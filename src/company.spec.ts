/*
This program and the accompanying materials are
made available under the terms of the Eclipse Public License v2.0 which accompanies
this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

SPDX-License-Identifier: EPL-2.0

Copyright Contributors to the Zowe Project.
*/

import { expect } from 'chai';
import request from 'supertest';
import { Department } from './types/department';

let req: request.SuperTest<request.Test>;
const url = process.env['API_URL'];
const login = process.env['API_USER'];
const password = process.env['API_PASSWORD'];

describe('Company API', function () {
  this.timeout(0);
  let token: string;

  before('login', async function () {
    req = request(url);
    const res = await req.post('/user_login').send({ login, password });
    expect(res.status, JSON.stringify(res.body)).to.equal(200);
    token = res.body.token;
  });

  it('should get a token', () => {
    expect(typeof token === 'string').to.be.true;
  });

  describe('Department', function () {
    this.timeout(0);
    let departments: Department[];

    before('get departments', async function () {
      req = request(url);
      const res = await req
        .get('/company_department_list')
        .set('Authorization', `Bearer ${token}`)
        .send();
      expect(res.status, JSON.stringify(res.body)).to.equal(200);
      departments = res.body;
    });

    it('should get an array', () => {
      expect(Array.isArray(departments)).to.be.true;
    });

    it('should count_position > 0 if count_user > 0', () => {
      for (const dept of departments) {
        if (dept.count_user > 0) {
          expect(
            dept.count_position > 0,
            `Как минимум одна должность должна быть в подразделении id=${dept.id} (${dept.name}), count_position = ${dept.count_position}, count_user = ${dept.count_user}`
          ).to.be.true;
        }
      }
    });

    it('should count_position <= count_user', () => {
      for (const dept of departments) {
        expect(
          dept.count_position <= dept.count_user,
          `Должностей в подразделении не может быть больше чем сотрудников id=${dept.id} (${dept.name}), count_position = ${dept.count_position}, count_user = ${dept.count_user}`
        ).to.be.true;
      }
    });
  })

});

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Zowe Project.
*/