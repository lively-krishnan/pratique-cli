
// api
let HostName = ''

const env = {
  // 生产
  PROD_URL: [],
  PROD_API: {
    HostName: ''
  },

  // 灰度
  PRE_URL: [],
  PRE_API: {
    HostName: ''
  },

  // 测试
  TEST_URL: [],
  TEST_API: {
    HostName: ''
  },

  // 开发
  DEV_URL: [],
  DEV_API: {
    HostName: ''
  },
}

function checkUrl(url: string): boolean {
  return window.location.href.indexOf(url) === 0
}

function inspection(url: string): boolean {
  return url.length > 0 && url.some(checkUrl)
}

// 生产
if (inspection(env.PROD_URL)) {
  HostName = env.PROD_API.HostName
  // 灰度
} else if (inspection(env.PRE_URL)) {
  HostName = env.PRE_API.HostName
  // 测试 
} else if (inspection(env.PRE_URL)) {
  HostName = env.TEST_API.HostName
  // 开发
} else {
  HostName = env.DEV_API.HostName
}


export {
  HostName
}