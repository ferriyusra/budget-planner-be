import httpContext from 'express-http-context';
import _ from 'lodash';
import { DateTime } from 'luxon';
import {
	createLogger,
	format,
	transports,
	Logger as WinstonLogger,
} from 'winston';

import { APP_NAME, APP_ENV } from './env';

class Logger {
	private logger: WinstonLogger;

	constructor() {
		this.logger = createLogger({
			transports: [
				new transports.Console({
					format: format.printf((info: any) => {
						let message = DateTime.local().toString();

						// append app name
						message += ` | ${APP_NAME} `;

						// append request id
						const requestId = httpContext.get('requestId');
						message += requestId ? `| ${requestId}` : '| -';

						// append message
						message += ` | ${info.level} | ${info.message}`;

						// append object
						if (info.obj !== undefined) {
							if (info.level !== 'error') {
								message += ` | ${JSON.stringify(info.obj)}`;
							} else {
								if (_.get(info, 'obj.stack')) {
									message += ` | ${JSON.stringify(info.obj.stack)}`;
								} else {
									message += ` | ${JSON.stringify(info.obj)}`;
								}
							}
						}

						return message;
					}),
				}),
			],
		});
	}

	public info(message: string, obj?: any): void {
		if (APP_ENV !== 'test') {
			let formattedObj: any;

			if (typeof obj === 'string') {
				// remove multiple spaces and line breaks
				formattedObj = obj
					.replace(/ +(?= )/g, '')
					.replace(/(\r\n|\n|\r)/gm, '');
			} else {
				formattedObj = obj;
			}

			this.logger.log('info', message, {
				obj: formattedObj,
			});
		}
	}

	public error(message: string, obj?: any): void {
		let formattedObj: any;

		if (typeof obj === 'string') {
			// remove multiple spaces and line breaks
			formattedObj = obj.replace(/ +(?= )/g, '').replace(/(\r\n|\n|\r)/gm, '');
		} else {
			formattedObj = obj;
		}

		this.logger.log('error', message, {
			obj: formattedObj,
		});
	}

	public warn(message: string, obj?: any): void {
		this.logger.log('warn', message, {
			obj,
		});
	}
}

// Export a singleton instance
export default new Logger();
