import HttpClient from './_httpClient';

const http = new HttpClient({
  baseURL: {
    dev: '',
    prod: ''
  },
  responseType: 'json',
  requestOnError: console.error,
  responseOnError: console.error
});

// http.setRequestInterceptors((conf) => {
//   const token = 111;
//   conf.headers.Authorization = `Bearer ${token}`;
//   return conf;
// });

http.setResponseInterceptors((res) => {
  if (res.data && res.data.success) return res.data;
  throw Error('111');
  console.log(res);
  return res;
});

export default http;

(async function test() {
  console.log('TEST');
  try {
    const r = await http.get('https://test-rap2delos.vip56.cn/app/mock/20/device/getInfo');
    console.log(r);
  } catch (e) {
    console.error('request error', e);
  }
})();
