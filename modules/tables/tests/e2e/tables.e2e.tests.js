'use strict';

describe('Tables E2E Tests:', function () {
  describe('Test Tables page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tables');
      expect(element.all(by.repeater('table in tables')).count()).toEqual(0);
    });
  });
});
