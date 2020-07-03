import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoutesProvider } from './routes';
import { Route, IRoute, Checkpoint } from '../../models/route';
import { AppConfigurations } from '../../assets/configuration';
import { AuthenticationProvider } from '../authentication/authentication';



describe('Service: RoutesProvider', () => {

  let service: RoutesProvider;
  let httpMock: HttpTestingController;
  let mockResponse: Array<IRoute>;
  let dataError: Error, dataResponse: Array<IRoute>, routeResponse: IRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: RoutesProvider, useClass: RoutesProvider },
        AuthenticationProvider,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(RoutesProvider);
    httpMock = TestBed.get(HttpTestingController);
    service.url = new AppConfigurations().url + 'api/route';
    mockResponse = [
        {
            id: 1,
            category: 'Happy Birthday',
            owner: 'Eliot Garcia',
            country: 'Bolivia',
            city: 'Colcapirhua',
            address: 'Av. Blanco Galindo km 2',
            date: '2018-10-10',
            checkpoints: [
                {
                    latitude : 17.03242,
                    length : 32.32343
                },
                {
                    latitude : 17.3242,
                    length : 32.32433
                }
            ]
        },
        {
            id: 2,
            category: 'Happy Day',
            owner: 'Eliot Fuentes',
            country: 'Bolivia',
            city: 'Cercado',
            address: 'Av. Blanco Galindo km 2',
            date: '2018-10-10',
            checkpoints: [
                {
                    latitude : 17.03242,
                    length : 32.32343
                },
                {
                    latitude : 17.3242,
                    length : 32.32433
                }
            ]
        }
    ];
  });

  afterEach(() => {
    httpMock.verify();
    dataError = undefined;
    dataResponse = undefined;
    routeResponse = undefined;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('When the postRoute method is called', () => {
    
    it('should add a new route', () => {
      let routeResponse: IRoute;
      const newRoute: IRoute = {
          category: 'Black Friday',
          owner: 'Eliot Garcia',
          country: 'Bolivia',
          city: 'Cercado',
          address: 'Av. Blanco Galindo km 2',
          date: '2018-10-10',
          checkpoints: [
              {
                  latitude : 18.03242,
                  length : 32.32343
              },
              {
                  latitude : 18.3242,
                  length : 32.32433
              }
          ]
      };
      service.postRoute(newRoute)
      .subscribe((response: IRoute) => {
        routeResponse = response;
      }, (error) => {
        dataError = error;
      });
      mockResponse = [...mockResponse, routeResponse];
      const req = httpMock.expectOne(service.url);
      req.flush(newRoute);
      expect(routeResponse.category).toEqual('Black Friday');
      expect(mockResponse.length).toEqual(3);
      expect(req.request.url).toEqual(service.url);
      expect(req.request.method).toEqual('POST');
      expect(dataError).toBeUndefined();
    });

    it('should return an error and do not add a new route without checkpoint', () => {
      let routeResponse: IRoute;
      const newRoute: IRoute = {
          category: 'Black Friday',
          owner: 'Eliot Garcia',
          country: 'Bolivia',
          city: 'Cercado',
          address: 'Av. Blanco Galindo km 2',
          date: '2018-10-10',
          checkpoints: []
      };
      service.postRoute(newRoute)
      .subscribe((response: IRoute) => {
        routeResponse = response;
      }, (error) => {
        dataError = error;
      });
      httpMock.expectOne(service.url)
      .error(new ErrorEvent('Bad Request'));
      expect(routeResponse).toBeUndefined();
      expect(dataError).toBeDefined();
    });
  });

  describe('When the getRoutes method is called', () => {

    it('should return all routes', () => {
      service.getRoutes()
      .subscribe((response: Array<IRoute>) => {
        dataResponse = response;
      }, (error) => {
        dataError = error;
      });
      const req = httpMock.expectOne(`${service.url}?category=&city=`);
      req.flush(mockResponse);
      expect(dataResponse.length).toEqual(2);
      expect(req.request.url).toBe(`${service.url}?category=&city=`);
      expect(req.request.method).toEqual('GET');
      expect(dataError).toBeUndefined();
    });

    it('should return routes by category searched', () => {
      const value = 'Happy Day';
      service.getRoutes(value)
      .subscribe((response: Array<IRoute>) => {
        dataResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect: Array<IRoute> = mockResponse.filter(route => route.category === value);
      const req = httpMock.expectOne(`${service.url}?category=${value}&city=`);
      req.flush(_expect);
      expect(dataResponse.length).toEqual(1);
      expect(dataResponse[0].id).toEqual(2);
      expect(req.request.url).toEqual(`${service.url}?category=${value}&city=`);
      expect(req.request.method).toEqual('GET');
      expect(dataError).toBeUndefined();
    });

    it('should return routes by city searched', () => {
      const value = 'Cercado';
      service.getRoutes('', value)
      .subscribe((response: Array<IRoute>) => {
        dataResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect: Array<IRoute> = mockResponse.filter(route => route.city === value);
      const req = httpMock.expectOne(`${service.url}?category=&city=${value}`);
      req.flush(_expect);
      expect(dataResponse.length).toEqual(1);
      expect(dataResponse[0].id).toEqual(2);
      expect(req.request.url).toEqual(`${service.url}?category=&city=${value}`);
      expect(req.request.method).toEqual('GET');
      expect(dataError).toBeUndefined();
    });

    it('should return routes by city  and category searched', () => {
      const city = 'Cercado';
      const category = 'Happy Day'
      service.getRoutes(category, city)
      .subscribe((response: Array<IRoute>) => {
        dataResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect: Array<IRoute> = mockResponse.filter(route => route.category === category && route.city === city);
      const req = httpMock.expectOne(`${service.url}?category=${category}&city=${city}`);
      req.flush(_expect);
      expect(dataResponse.length).toEqual(1);
      expect(dataResponse[0].id).toEqual(2);
      expect(req.request.url).toEqual(`${service.url}?category=${category}&city=${city}`);
      expect(req.request.method).toEqual('GET');
      expect(dataError).toBeUndefined();
    });
  });

  describe('When the getRouteOf method is called', () => {

    it('should return all routes of an owner', () => {
      const owner = 'Eliot Fuentes';
      service.getRoutesOf(owner)
      .subscribe((response: Array<IRoute>) => {
        dataResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect = mockResponse.filter(route => route.owner === owner);
      const req = httpMock.expectOne(`${service.url}/owner/${owner}`);
      req.flush(_expect);
      expect(dataResponse.length).toEqual(1);
      expect(req.request.url).toEqual(`${service.url}/owner/${owner}`);
      expect(req.request.method).toEqual('GET');
      expect(dataError).toBeUndefined();
      httpMock.verify();
    });

    it('should return empty if an owner do not have any route created', () => {
      const owner = 'Jose Fuentes';
      service.getRoutesOf(owner)
      .subscribe((response: Array<IRoute>) => {
        dataResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect = mockResponse.filter(route => route.owner === owner);
      const req = httpMock.expectOne(`${service.url}/owner/${owner}`);
      req.flush(_expect);
      expect(dataResponse.length).toEqual(0);
      expect(req.request.url).toEqual(`${service.url}/owner/${owner}`);
      expect(req.request.method).toEqual('GET');
      expect(dataError).toBeUndefined();
      httpMock.verify();
    });

  });

  describe('When the deleteRoute method is called', () => {

    it('should remove a route by id', () => {
      const id = 1;
      let removeResponse: IRoute;
      service.deleteRoute(id)
      .subscribe((response: IRoute) => {
        removeResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect = mockResponse.filter(route => route.id === id)[0];
      const req = httpMock.expectOne(`${service.url}/${id}`);
      req.flush(_expect);
      expect(removeResponse.id).toEqual(id);
      expect(req.request.url).toEqual(`${service.url}/${id}`);
      expect(req.request.method).toEqual('DELETE');
      expect(dataError).toBeUndefined();
      httpMock.verify();
    });

    it('should return an error if the route do not exist', async(() => {
      let removeResponse: IRoute;
      const id = 9;
      service.deleteRoute(id)
      .subscribe((response: IRoute) => {
        removeResponse = response;
      }, (error) => {
        dataError = error;
      });
      httpMock.expectOne(`${service.url}/${id}`)
      .error(new ErrorEvent('Do not found'));
      expect(removeResponse).toBeUndefined();
      expect(dataError).toBeDefined();
      httpMock.verify();
    }));

  });

  describe('When the getRoute method is called', () => {

    it('should return a route by id', () => {
      const id = 1;
      let routeResponse: IRoute;
      service.getRoute(id)
      .subscribe((response: IRoute) => {
        routeResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect: IRoute = mockResponse.filter(route => route.id === id)[0];
      const req = httpMock.expectOne(`${service.url}/${id}`);
      req.flush(_expect);
      expect(routeResponse.id).toEqual(id);
      expect(req.request.url).toEqual(`${service.url}/${id}`);
      expect(req.request.method).toEqual('GET');
      expect(dataError).toBeUndefined();
      httpMock.verify();
    });

    it('should return an error if the route do not exist', () => {
      const id = 18
      let routeResponse: IRoute;
      service.getRoute(id)
      .subscribe((response: IRoute) => {
        routeResponse = response;
      }, (error) => {
        dataError = error;
      });
      httpMock.expectOne(`${service.url}/${id}`)
      .error(new ErrorEvent('Do not found'));
      expect(routeResponse).toBeUndefined();
      expect(dataError).toBeDefined();
      httpMock.verify();
    });

  });

  describe('When the editRoute method is called', () => {

    it('should edit a route by id', () => {
      const idRoute = 1;
      const newRoute: IRoute = {
        category: '10 K',
        owner: 'Eliot Garcia',
        country: 'Bolivia',
        city: 'Quillacollo',
        address: 'Av. Blanco Galindo km 20',
        date: '2018-11-11',
        checkpoints: [
            {
                latitude : 18.03242,
                length : 32.32343
            },
            {
                latitude : 18.3242,
                length : 32.32433
            }
        ]
      };
      service.editRoute(idRoute, newRoute)
      .subscribe((response: IRoute) => {
        routeResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect: IRoute = {...routeResponse, id: idRoute}
      const req = httpMock.expectOne(`${service.url}/${idRoute}`);
      req.flush(_expect);
      expect(req.request.body.category).toEqual('10 K');
      expect(req.request.url).toEqual(`${service.url}/${idRoute}`);
      expect(req.request.method).toEqual('PUT');
      expect(dataError).toBeUndefined();
      httpMock.verify();
    });

    it('should return an error if the route do not exist', () => {
      const idRoute = 10;
      const newRoute: IRoute = {
        category: '10 K',
        owner: 'Eliot Garcia',
        country: 'Bolivia',
        city: 'Quillacollo',
        address: 'Av. Blanco Galindo km 20',
        date: '2018-11-11',
        checkpoints: [
            {
                latitude : 18.03242,
                length : 32.32343
            },
            {
                latitude : 18.3242,
                length : 32.32433
            }
        ]
      };
      service.editRoute(idRoute, newRoute)
      .subscribe((response: IRoute) => {
        routeResponse = response;
      }, (error) => {
        dataError = error;
      });
      httpMock.expectOne(`${service.url}/${idRoute}`)
      .error(new ErrorEvent('Do not found'));
      expect(routeResponse).toBeUndefined();
      expect(dataError).toBeDefined();
      httpMock.verify();
    });

  });

});