(function () {
  'use strict';

  describe('Tables Route Tests', function () {
    // Initialize global variables
    var $scope,
      TablesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _TablesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      TablesService = _TablesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('tables');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/tables');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          TablesController,
          mockTable;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('tables.view');
          $templateCache.put('modules/tables/client/views/view-table.client.view.html', '');

          // create mock Table
          mockTable = new TablesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Table Name'
          });

          // Initialize Controller
          TablesController = $controller('TablesController as vm', {
            $scope: $scope,
            tableResolve: mockTable
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:tableId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.tableResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            tableId: 1
          })).toEqual('/tables/1');
        }));

        it('should attach an Table to the controller scope', function () {
          expect($scope.vm.table._id).toBe(mockTable._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/tables/client/views/view-table.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          TablesController,
          mockTable;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('tables.create');
          $templateCache.put('modules/tables/client/views/form-table.client.view.html', '');

          // create mock Table
          mockTable = new TablesService();

          // Initialize Controller
          TablesController = $controller('TablesController as vm', {
            $scope: $scope,
            tableResolve: mockTable
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.tableResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/tables/create');
        }));

        it('should attach an Table to the controller scope', function () {
          expect($scope.vm.table._id).toBe(mockTable._id);
          expect($scope.vm.table._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/tables/client/views/form-table.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          TablesController,
          mockTable;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('tables.edit');
          $templateCache.put('modules/tables/client/views/form-table.client.view.html', '');

          // create mock Table
          mockTable = new TablesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Table Name'
          });

          // Initialize Controller
          TablesController = $controller('TablesController as vm', {
            $scope: $scope,
            tableResolve: mockTable
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:tableId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.tableResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            tableId: 1
          })).toEqual('/tables/1/edit');
        }));

        it('should attach an Table to the controller scope', function () {
          expect($scope.vm.table._id).toBe(mockTable._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/tables/client/views/form-table.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
