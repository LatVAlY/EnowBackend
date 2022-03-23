import { ApolloError } from "apollo-server"

export interface ErrorResource {
  message: string
  name: string
  type: string
  status: number
  details: any
}

const createErrorResource = (status: number, name: string, message: string, details: any): ErrorResource => {
  return {
    name,
    message,
    status,
    details,
    type: `https://httpstatus.es/${status}`
  }
}

interface ErrorDetail {
  error_code: string
  [key: string]: any
}

export const createErrorCodeDetails = (errorCode: string): ErrorDetail => {
  return {error_code: errorCode}
}

export const getUnauthorizedError = (): ApolloError => {
  const err = createErrorResource(401, "UNAUTHORIZED", "Invalid token", createErrorCodeDetails("INVALID_TOKEN"))
  return new ApolloError("UNAUTHORIZED", "UNAUTHORIZED", {response: err});
}

export const getForbiddenError = (customMessage?: string): ApolloError => {
  const err = createErrorResource(403, "FORBIDDEN", "Lack permission", createErrorCodeDetails("LACK_PERMISSION"))
  return new ApolloError(customMessage || "FORBIDDEN" , "FORBIDDEN", {response: err});
}

export const getResourceNotFoundError = (details?: {[key: string]: any}): ApolloError => {
  const errorCode = createErrorCodeDetails("RESOURCE_NOT_FOUND")
  const errorDetails = details ? Object.assign({}, errorCode, details) : errorCode
  const err = createErrorResource(404, "NOT_FOUND", "Resource not found", errorDetails)
  return new ApolloError("NOT_FOUND" , "NOT_FOUND", {response: err});
}

export const getConflictError = (customErrorCode: string, details?: {[key: string]: any}): ApolloError => {
  const errorCode = createErrorCodeDetails(customErrorCode)
  const errorDetails = details ? Object.assign({}, errorCode, details) : errorCode
  const err = createErrorResource(409, "CONFLICT", "Conflict!", errorDetails)
  return new ApolloError("CONFLICT" , "CONFLICT", {response: err});
}
