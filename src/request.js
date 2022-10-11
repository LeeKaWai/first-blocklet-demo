import http  from './http'


export function login(params) {
	return http({
		url: '/',
		method: 'get',
	});
}
