/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { expect } from 'chai';
import request from 'supertest';

let req: request.SuperTest<request.Test>;
const url = process.env['API_URL'];
const login = process.env['API_USER'];
const password = process.env['API_PASSWORD'];

describe('User API', function () {
  this.timeout(0);
  this.bail(true);
  let token: string;
  
  console.log(`Testing against ${url} with user ${login} ${password?.replace(/./g, '*')}`);

  before('login', async function () {
    req = request(url);
    const res = await req.post('/user_login').send({ login, password });
    expect(res.status, JSON.stringify(res.body)).to.equal(200);
    token = res.body.token;
  });

  it('should get a token', () => {
    expect(typeof token === 'string').to.be.true;
  });

});

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/