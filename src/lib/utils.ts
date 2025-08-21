import { utilsApiUrl } from "@/api"
import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getCSRFToken() {
  const res = await axios.get(utilsApiUrl.getCSRFToken, {
    withCredentials: true,
  })
  console.log("CSRF Token:", res)
  return res.data?.csrf_token || ""
}
