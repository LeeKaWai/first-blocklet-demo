import axios from 'axios';


// 配置新建一个 axios 实例
const http = axios.create({
	baseURL: 'http://localhost:3500',
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
    withCredentials: true,  //跨域携带cookie
});

// 导出 axios 实例
export default http;

