const newWindow = window as any
newWindow.Intercom = newWindow.Intercom || []

type TBootIntercom = {
  email?: string
  user_hash?: string
}

export const hashHMAC = async (algorithm: string, key: string, message: string) => {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  const messageData = encoder.encode(message)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: algorithm } },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)

  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const bootIntercom = (params: TBootIntercom) => {
  const { email, user_hash } = params

  const options = {
    app_id: import.meta.env.VITE_INTERCOM_APP_ID
  } as TBootIntercom

  if (email && user_hash) {
    options.email = email
    options.user_hash = user_hash
  }

  if (newWindow.Intercom) {
    newWindow.Intercom('boot', options)
  }
}

export const startIntercom = () => {
  newWindow.config = {
    intercomWidgetUrl: import.meta.env.VITE_INTERCOM_APP_ID
  }
  bootIntercom({})
}

export const initializeIntercom = (email: string) => {
  const secret = import.meta.env.VITE_INTERCOM_SECRET_KEY

  hashHMAC('SHA-256', secret, email).then((hash) => {
    if (newWindow.Intercom) {
      bootIntercom({
        email: email,
        user_hash: hash
      })
    } else {
      setTimeout(initializeIntercom, 100)
    }
  })
}

export const stopIntercom = () => {
  if (newWindow.Intercom) {
    newWindow.Intercom('shutdown')
    bootIntercom({})
  }
}

export const handleSupport = () => {
  if (newWindow.Intercom) {
    newWindow.Intercom('show')
  }
}
