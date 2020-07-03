import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BikesProvider } from './bikes';
import { AppConfigurations } from '../../assets/configuration';
import { IBike } from '../../models/bike';
import { AuthenticationProvider } from '../authentication/authentication';



describe('Service: BikesProvider', () => {

  let service: BikesProvider;
  let httpMock: HttpTestingController;
  let mockResponse: Array<IBike>;
  let dataError: Error, dataResponse: Array<IBike>, bikeResponse: IBike;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: BikesProvider, useClass: BikesProvider },
        AuthenticationProvider,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(BikesProvider);
    httpMock = TestBed.get(HttpTestingController);
    service.url = new AppConfigurations().url;
    mockResponse = [
      {
        id: 1,
        rentPointId: 1,
        description: 'Bike 2000',
        price: 40,
        disponible: true,
        image: "www.image.com/1"
      },
      {
        id: 2,
        rentPointId: 1,
        description: 'Bike 3000',
        price: 80,
        disponible: true,
        image: "www.image.com/2"
      }
    ];
  });

  afterEach(() => {
    httpMock.verify();
    dataError = undefined;
    dataResponse = undefined;
    bikeResponse = undefined;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('When the postBike method is called', () => {
    
    it('should add a new bike', () => {
      let bikeResponse: IBike;
      const newBike: IBike = {
        rentPointId: 1,
        description: 'Bike 4000',
        price: 100,
        disponible: true,
        image: "www.image.com/3"
      };
      service.postBike(newBike)
      .subscribe((response: IBike) => {
        bikeResponse = response;
      }, (error) => {
        dataError = error;
      });
      mockResponse = [...mockResponse, bikeResponse];
      const req = httpMock.expectOne(`${service.url}api/rent-point/${newBike.rentPointId}/bikes`);
      req.flush(newBike);
      expect(bikeResponse.description).toEqual('Bike 4000');
      expect(mockResponse.length).toEqual(3);
      expect(req.request.url).toEqual(`${service.url}api/rent-point/${newBike.rentPointId}/bikes`);
      expect(req.request.method).toEqual('POST');
      expect(dataError).toBeUndefined();
    });
    
  });

  describe('When the getBikeOf method is called', () => {

    it('should return all bikes of a rent point', () => {
      const rentPointId = 1;
      service.getBikesOf(rentPointId)
      .subscribe((response: Array<IBike>) => {
        dataResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect = mockResponse.filter(bike => bike.id === rentPointId);
      const req = httpMock.expectOne(`${service.url}api/rent-point/${rentPointId}/bikes`);
      req.flush(_expect);
      expect(dataResponse.length).toEqual(1);
      expect(req.request.url).toEqual(`${service.url}api/rent-point/${rentPointId}/bikes`);
      expect(req.request.method).toEqual('GET');
      expect(dataError).toBeUndefined();
      httpMock.verify();
    });

    it('should return empty if an rentPointId do not have any bike created', () => {
      const rentPointId = 91;
      service.getBikesOf(rentPointId)
      .subscribe((response: Array<IBike>) => {
        dataResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect = mockResponse.filter(bike => bike.id === rentPointId);
      const req = httpMock.expectOne(`${service.url}api/rent-point/${rentPointId}/bikes`);
      req.flush(_expect);
      expect(dataResponse.length).toEqual(0);
      expect(req.request.url).toEqual(`${service.url}api/rent-point/${rentPointId}/bikes`);
      expect(req.request.method).toEqual('GET');
      expect(dataError).toBeUndefined();
      httpMock.verify();
    });

  });

  describe('When the deleteBike method is called', () => {

    it('should remove a bike by id', () => {
      const id = 1;
      let removeResponse: IBike;
      service.deleteBike(id)
      .subscribe((response: IBike) => {
        removeResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect = mockResponse.filter(bike => bike.id === id)[0];
      const req = httpMock.expectOne(`${service.url}api/bikes/${id}`);
      req.flush(_expect);
      expect(removeResponse.id).toEqual(id);
      expect(req.request.url).toEqual(`${service.url}api/bikes/${id}`);
      expect(req.request.method).toEqual('DELETE');
      expect(dataError).toBeUndefined();
    });

    it('should return an error if the bike do not exist', async(() => {
      let removeResponse: IBike;
      const id = 9;
      service.deleteBike(id)
      .subscribe((response: IBike) => {
        removeResponse = response;
      }, (error) => {
        dataError = error;
      });
      httpMock.expectOne(`${service.url}api/bikes/${id}`)
      .error(new ErrorEvent('Do not found'));
      expect(removeResponse).toBeUndefined();
      expect(dataError).toBeDefined();
    }));

  });

  describe('When the getBike method is called', () => {

    it('should return a bike by id', () => {
      const bikeId = 1;
      const rentPointId = 1;
      let bikeResponse: IBike;
      service.getBike(rentPointId, bikeId)
      .subscribe((response: IBike) => {
        bikeResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect: IBike = mockResponse.filter(bike => bike.id === bikeId)[0];
      const req = httpMock.expectOne(`${service.url}api/rent-point/${rentPointId}/bikes/${bikeId}`);
      req.flush(_expect);
      expect(bikeResponse.id).toEqual(bikeId);
      expect(req.request.url).toEqual(`${service.url}api/rent-point/${rentPointId}/bikes/${bikeId}`);
      expect(req.request.method).toEqual('GET');
      expect(dataError).toBeUndefined();
      httpMock.verify();
    });

    it('should return an error if the bike do not exist', () => {
      const bikeId = 100;
      const rentPointId = 1;
      let bikeResponse: IBike;
      service.getBike(rentPointId, bikeId)
      .subscribe((response: IBike) => {
        bikeResponse = response;
      }, (error) => {
        dataError = error;
      });
      httpMock.expectOne(`${service.url}api/rent-point/${rentPointId}/bikes/${bikeId}`)
      .error(new ErrorEvent('Do not found'));
      expect(bikeResponse).toBeUndefined();
      expect(dataError).toBeDefined();
      httpMock.verify();
    });

  });

  describe('When the editBike method is called', () => {

    it('should edit a bike by id', () => {
      const idBike = 1;
      const newBike: IBike = {
        id: idBike,
        rentPointId: 1,
        description: 'Bike 4000',
        price: 100,
        disponible: true,
        image: "www.image.com/3"
      };
      service.editBike(newBike)
      .subscribe((response: IBike) => {
        bikeResponse = response;
      }, (error) => {
        dataError = error;
      });
      const _expect: IBike = {...bikeResponse}
      const req = httpMock.expectOne(`${service.url}api/rent-point/${newBike.rentPointId}/bikes/${newBike.id}`);
      req.flush(_expect);
      expect(req.request.body.description).toEqual('Bike 4000');
      expect(req.request.url).toEqual(`${service.url}api/rent-point/${newBike.rentPointId}/bikes/${newBike.id}`);
      expect(req.request.method).toEqual('PUT');
      expect(dataError).toBeUndefined();
      httpMock.verify();
    });

    it('should return an error if the bike do not exist', () => {
      const idBike = 10;
      const newBike: IBike = {
        rentPointId: 1,
        description: 'Bike 4000',
        price: 100,
        disponible: true,
        image: "www.image.com/3"
      };
      service.editBike(newBike)
      .subscribe((response: IBike) => {
        bikeResponse = response;
      }, (error) => {
        dataError = error;
      });
      httpMock.expectOne(`${service.url}api/rent-point/${newBike.rentPointId}/bikes/${newBike.id}`)
      .error(new ErrorEvent('Do not found'));
      expect(bikeResponse).toBeUndefined();
      expect(dataError).toBeDefined();
      httpMock.verify();
    });

  });

});