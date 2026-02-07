'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import { setLoginUser } from '@/store/modules'
import { githubLoginGet } from '@/api/user/userController'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function GitHubCallbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        const code = searchParams.get('code')
        const state = searchParams.get('state')

        if (!code) {
            setError('未获取到授权码')
            router.replace('/')
            return
        }

        const login = async () => {
            try {
                const res = (await githubLoginGet({ arg0: { code, state: state || '' } })) as unknown as UserAPI.BaseResponseUserVO
                if (res.code === 0 && res.data) {
                    dispatch(setLoginUser(res.data))
                    toast.success('登录成功')
                    router.replace('/')
                } else {
                    setError(res.message || 'Github 登录失败')
                    toast.error(res.message || 'Github 登录失败')
                    setTimeout(() => router.replace('/'), 2000)
                }
            } catch (err: any) {
                setError(err.message || '登录异常')
                toast.error(err.message || '登录异常')
                setTimeout(() => router.replace('/'), 2000)
            }
        }

        login()
    }, [searchParams, dispatch, router])

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center gap-4">
                {error ? (
                    <div className="text-red-500 font-medium">{error}</div>
                ) : (
                    <>
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground">正在处理 GitHub 登录...</p>
                    </>
                )}
            </div>
        </div>
    )
}

export default function GitHubCallbackPage() {
    return (
        <React.Suspense
            fallback={
                <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            }
        >
            <GitHubCallbackContent />
        </React.Suspense>
    )
}
