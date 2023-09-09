import type { AxiosInstance, AxiosResponse } from 'axios'
import { Config } from '../types/config'
import { AxiosRepository } from '../repository/AxiosRepository'
import { Response } from './Response'

export class Request {
  /**
   * The repository class.
   */
  repository: AxiosRepository

  /**
   * The default config.
   */
  config: Config = {
    save: true
  }

  /**
   * Create a new api instance.
   */
  constructor (repository: AxiosRepository) {
    this.repository = repository

    this.registerActions()
  }

  /**
   * Index key for the user defined actions.
   */
  [action: string]: any

  /**
   * Get the axios client.
   */
  get axios (): AxiosInstance {
    if (!this.repository.axios) {
      throw new Error(
        '[Vuex ORM Axios] The axios instance is not registered. Please register the axios instance to the repository.'
      )
    }

    return this.repository.axios
  }

  /**
   * Register actions from the repository config.
   */
  private registerActions (): void {
    const actions = { ...this.repository.apiConfig.actions, ...this.repository.getModel().$config()?.axios?.actions }

    if (!actions) {
      return
    }

    for (const name in actions) {
      const action = actions[name]

      typeof action === 'function'
        ? this.registerFunctionAction(name, action)
        : this.registerObjectAction(name, action)
    }
  }

  /**
   * Register the given object action.
   */
  private registerObjectAction (name: string, action: any): void {
    this[name] = (config: Config) => {
      return this.request({ ...action, ...config })
    }
  }

  /**
   * Register the given function action.
   */
  private registerFunctionAction (name: string, action: any): void {
    this[name] = action.bind(this)
  }

  /**
   * Perform a get request.
   */
  get (url: string, config: Config = {}): Promise<Response> {
    return this.request({ method: 'get', url, ...config })
  }

  /**
   * Perform a post request.
   */
  post (url: string, data: any = {}, config: Config = {}): Promise<Response> {
    return this.request({ method: 'post', url, data, ...config })
  }

  /**
   * Perform a put request.
   */
  put (url: string, data: any = {}, config: Config = {}): Promise<Response> {
    return this.request({ method: 'put', url, data, ...config })
  }

  /**
   * Perform a patch request.
   */
  patch (url: string, data: any = {}, config: Config = {}): Promise<Response> {
    return this.request({ method: 'patch', url, data, ...config })
  }

  /**
   * Perform a delete request.
   */
  delete (url: string, config: Config = {}): Promise<Response> {
    return this.request({ method: 'delete', url, ...config })
  }

  /**
   * Perform an api request.
   */
  async request (config: Config): Promise<Response> {
    const requestConfig = this.createConfig(config)

    const axiosResponse = await this.axios.request(requestConfig)

    return this.createResponse(axiosResponse, requestConfig)
  }

  /**
   * Create a new config by merging the global config, the repository config,
   * and the given config.
   */
  private createConfig (config: Config): Config {
    return {
      ...this.config,
      ...this.repository.globalApiConfig,
      ...this.repository.apiConfig,
      ...config
    }
  }

  /**
   * Create a new response instance by applying a few initialization processes.
   * For example, it saves response data if `save` option id set to `true`.
   */
  private async createResponse (
    axiosResponse: AxiosResponse,
    config: Config
  ): Promise<Response> {
    const response = new Response(this.repository, config, axiosResponse)

    if (config.delete !== undefined) {
      await response.delete()

      return response
    }

    config.save && (await response.save())

    return response
  }
}
