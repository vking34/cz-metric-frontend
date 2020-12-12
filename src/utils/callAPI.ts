import axios from "axios"
import * as Config from "../contants/config"
import { getCookie } from "../common/BaseFunction"

type response = {
  result: {
    data: any,
    status: number
  }
  error: any
}


export const callApi = async (endpoint: string, method: any, body: any, isNeedAuth: boolean) => {
  let response: response = {
    result: {
      data: null,
      status: 500,
    },
    error: null
  }
  let newHeaders: any = {};
  if (isNeedAuth) {
    const token: string = getCookie('token')!;
    newHeaders['X-chozoi-token'] = token;
  }

  try {
    const result = await axios({
      method: method,
      url: `${Config.API_URL}${endpoint}`,
      data: body,
    })
    response.result.data = result.data;
    response.result.status = result.status;
  } catch (error) {
    console.log("error : ", error); 
    response.error = error.response?.data.message;
    response.result.status = error.response?.status
  }

  return response;
}