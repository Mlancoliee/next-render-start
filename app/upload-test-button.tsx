"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, CheckCircle2, XCircle, Download } from "lucide-react"

export function UploadTestButton() {
  const [uploadLoading, setUploadLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{
    status: "success" | "error" | null
    message: string
    data?: any
  }>({ status: null, message: "" })
  const [downloadResult, setDownloadResult] = useState<{
    status: "success" | "error" | null
    message: string
    data?: any
  }>({ status: null, message: "" })

  const testUpload = async (sizeInMB: number) => {
    setUploadLoading(true)
    setUploadResult({ status: null, message: "" })

    try {
      // 生成指定大小的数据
      const sizeInBytes = sizeInMB * 1024 * 1024
      const data = new Uint8Array(sizeInBytes).fill(65) // 填充字符 'A'

      const response = await fetch("/upload/limit-8mb", {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: data,
      })

      const responseData = await response.json()

      if (response.ok) {
        setUploadResult({
          status: "success",
          message: `成功上传 ${sizeInMB}MB 数据`,
          data: responseData,
        })
      } else {
        setUploadResult({
          status: "error",
          message: `上传失败 (${response.status}): ${responseData.reason || responseData.error || "未知错误"}`,
          data: responseData,
        })
      }
    } catch (error) {
      setUploadResult({
        status: "error",
        message: `请求出错: ${error instanceof Error ? error.message : "未知错误"}`,
      })
    } finally {
      setUploadLoading(false)
    }
  }

  const testDownload = async (sizeInMB: number) => {
    setDownloadLoading(true)
    setDownloadResult({ status: null, message: "" })

    const startTime = Date.now()
    
    try {
      const sizeInBytes = sizeInMB * 1024 * 1024
      const response = await fetch(`/response/big?bytes=${sizeInBytes}`)

      if (!response.ok) {
        setDownloadResult({
          status: "error",
          message: `下载失败 (${response.status}): ${response.statusText}`,
        })
        return
      }

      // 读取响应流
      const reader = response.body?.getReader()
      if (!reader) {
        setDownloadResult({
          status: "error",
          message: "无法读取响应流",
        })
        return
      }

      let receivedBytes = 0
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) {
          receivedBytes += value.length
        }
      }

      const endTime = Date.now()
      const duration = ((endTime - startTime) / 1000).toFixed(2)
      const receivedMB = (receivedBytes / 1024 / 1024).toFixed(2)

      setDownloadResult({
        status: "success",
        message: `成功下载 ${receivedMB}MB 数据`,
        data: {
          requestedBytes: sizeInBytes,
          receivedBytes,
          receivedMB: `${receivedMB} MB`,
          duration: `${duration} 秒`,
          speed: `${(receivedBytes / 1024 / 1024 / parseFloat(duration)).toFixed(2)} MB/s`,
        },
      })
    } catch (error) {
      setDownloadResult({
        status: "error",
        message: `请求出错: ${error instanceof Error ? error.message : "未知错误"}`,
      })
    } finally {
      setDownloadLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 上传测试区域 */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">📤 请求限制测试（上传）</h3>
        <p className="text-sm text-gray-600">测试 POST 请求的 8MB 大小限制</p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => testUpload(1)}
            disabled={uploadLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {uploadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            上传 1MB
          </Button>

          <Button
            onClick={() => testUpload(5)}
            disabled={uploadLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {uploadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            上传 5MB
          </Button>

          <Button
            onClick={() => testUpload(10)}
            disabled={uploadLoading}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {uploadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            上传 10MB
          </Button>

          <Button
            onClick={() => testUpload(15)}
            disabled={uploadLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {uploadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            上传 15MB
          </Button>
        </div>

        {uploadResult.status && (
          <Alert className={uploadResult.status === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
            <div className="flex items-start">
              {uploadResult.status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              )}
              <AlertDescription className="flex-1">
                <div className="font-medium mb-2">{uploadResult.message}</div>
                {uploadResult.data && (
                  <pre className="text-xs bg-white/50 p-2 rounded mt-2 overflow-auto max-h-40">
                    {JSON.stringify(uploadResult.data, null, 2)}
                  </pre>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>

      {/* 分割线 */}
      <div className="border-t border-gray-200" />

      {/* 下载测试区域 */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">📥 响应大小测试（下载）</h3>
        <p className="text-sm text-gray-600">测试服务端返回大响应数据的能力</p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => testDownload(1)}
            disabled={downloadLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {downloadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            下载 1MB
          </Button>

          <Button
            onClick={() => testDownload(5)}
            disabled={downloadLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {downloadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            下载 5MB
          </Button>

          <Button
            onClick={() => testDownload(10)}
            disabled={downloadLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {downloadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            下载 10MB
          </Button>

          <Button
            onClick={() => testDownload(20)}
            disabled={downloadLoading}
            className="bg-pink-600 hover:bg-pink-700"
          >
            {downloadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            下载 20MB
          </Button>
        </div>

        {downloadResult.status && (
          <Alert className={downloadResult.status === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
            <div className="flex items-start">
              {downloadResult.status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              )}
              <AlertDescription className="flex-1">
                <div className="font-medium mb-2">{downloadResult.message}</div>
                {downloadResult.data && (
                  <pre className="text-xs bg-white/50 p-2 rounded mt-2 overflow-auto max-h-40">
                    {JSON.stringify(downloadResult.data, null, 2)}
                  </pre>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>
    </div>
  )
}

