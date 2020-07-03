
using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using CyclepathAPI.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Linq;

namespace CyclepathTest
{
    [TestClass]
    public class RouteTest
    {
        [TestMethod]
        public void getRoutes()
        {
            var routes = new List<Route>
            {
                new Route
                {
                    Id = 1,
                    Category = "Marathon",
                    Owner = "rocio",
                    Country = "Bolivia",
                    City = "Cochabamba",
                    Address = "Av.Ballivian",
                    Date = "03/12/2018"
                },
                new Route
                {
                    Id = 2,
                    Category = "Tour",
	                Owner = "roxana",
	                Country = "Bolivia",
	                City = "Cochabamba",
	                Address = "Melchor Perez",
	                Date = "03/12/2018"
                },
            }.AsQueryable();

            var checkpoints = new List<Checkpoint>
            {

            }.AsQueryable();

            var mockSet = new Mock<DbSet<Route>>();
            mockSet.As<IQueryable<Route>>().Setup(m => m.Provider).Returns(routes.Provider);
            mockSet.As<IQueryable<Route>>().Setup(m => m.Expression).Returns(routes.Expression);
            mockSet.As<IQueryable<Route>>().Setup(m => m.ElementType).Returns(routes.ElementType);
            mockSet.As<IQueryable<Route>>().Setup(m => m.GetEnumerator()).Returns(routes.GetEnumerator());


            var mockSet2 = new Mock<DbSet<Checkpoint>>();
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Provider).Returns(checkpoints.Provider);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Expression).Returns(checkpoints.Expression);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.ElementType).Returns(checkpoints.ElementType);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.GetEnumerator()).Returns(checkpoints.GetEnumerator());

            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Routes).Returns(mockSet.Object);
            mockContext.Setup(c => c.Checkpoints).Returns(mockSet2.Object);
            var configuration = new Mock<IConfiguration>();
            var service = new RoutesRepository(mockContext.Object);

            var routesMock = service.GetAll().ToList();
            Assert.AreEqual(2, routesMock.Count);
            Assert.AreEqual("Cochabamba", routesMock[0].City);
            Assert.AreEqual("Melchor Perez", routesMock[1].Address);
        }
        [TestMethod]
        public void getOneRoute()
        {
            var routes = new List<Route>
            {
                new Route
                {
                    Id = 1,
                    Category = "Fun day",
                    Owner = "Lucas",
                    Country = "Bolivia",
                    City = "Cochabamba",
                    Address = "Av.Santa Cruz",
                    Date = "03/12/2018"
                },
                new Route
                {
                    Id = 2,
                    Category = "Tour",
                    Owner = "roxana",
                    Country = "Bolivia",
                    City = "Cochabamba",
                    Address = "Av.Blanco Galindo",
                    Date = "03/12/2018"
                },
            }.AsQueryable();

            var checkpoints = new List<Checkpoint>
            {
                new Checkpoint
                {
                    Id = 1,
                    Latitude = 12.12243,
                    Length = -32.243434,
                    RouteId = 1
                },
                new Checkpoint
                {
                    Id = 2,
                    Latitude = 15.12243,
                    Length = -32.243434,
                    RouteId = 1
                }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Route>>();
            mockSet.As<IQueryable<Route>>().Setup(m => m.Provider).Returns(routes.Provider);
            mockSet.As<IQueryable<Route>>().Setup(m => m.Expression).Returns(routes.Expression);
            mockSet.As<IQueryable<Route>>().Setup(m => m.ElementType).Returns(routes.ElementType);
            mockSet.As<IQueryable<Route>>().Setup(m => m.GetEnumerator()).Returns(routes.GetEnumerator());

            var mockSet2 = new Mock<DbSet<Checkpoint>>();
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Provider).Returns(checkpoints.Provider);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Expression).Returns(checkpoints.Expression);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.ElementType).Returns(checkpoints.ElementType);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.GetEnumerator()).Returns(checkpoints.GetEnumerator());

            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Routes).Returns(mockSet.Object);
            mockContext.Setup(c => c.Checkpoints).Returns(mockSet2.Object);
            var service = new RoutesRepository(mockContext.Object);

            Route route = service.GetOne(1);
            Assert.AreEqual("Lucas", route.Owner);
        }
        [TestMethod]
        public void getRoutesByCity()
        {
            var routes = new List<Route>
            {
                new Route
                {
                    Id = 1,
                    Category = "Marathon",
                    Owner = "rocio",
                    Country = "Bolivia",
                    City = "Colcapirhua",
                    Address = "Av.Ballivian",
                    Date = "03/12/2018"
                },
                new Route
                {
                    Id = 2,
                    Category = "Tour",
                    Owner = "roxana",
                    Country = "Bolivia",
                    City = "Cochabamba",
                    Address = "Melchor Perez",
                    Date = "03/12/2018"
                },
            }.AsQueryable();

            var checkpoints = new List<Checkpoint>
            {

            }.AsQueryable();

            var mockSet = new Mock<DbSet<Route>>();
            mockSet.As<IQueryable<Route>>().Setup(m => m.Provider).Returns(routes.Provider);
            mockSet.As<IQueryable<Route>>().Setup(m => m.Expression).Returns(routes.Expression);
            mockSet.As<IQueryable<Route>>().Setup(m => m.ElementType).Returns(routes.ElementType);
            mockSet.As<IQueryable<Route>>().Setup(m => m.GetEnumerator()).Returns(routes.GetEnumerator());


            var mockSet2 = new Mock<DbSet<Checkpoint>>();
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Provider).Returns(checkpoints.Provider);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Expression).Returns(checkpoints.Expression);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.ElementType).Returns(checkpoints.ElementType);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.GetEnumerator()).Returns(checkpoints.GetEnumerator());

            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Routes).Returns(mockSet.Object);
            mockContext.Setup(c => c.Checkpoints).Returns(mockSet2.Object);
            var configuration = new Mock<IConfiguration>();
            var service = new RoutesRepository(mockContext.Object);

            var routesMock = service.GetAllRoutes(null, "Cochabamba").ToList();
            Assert.AreEqual(1, routesMock.Count);
            Assert.AreEqual("Cochabamba", routesMock[0].City);
        }
        [TestMethod]
        public void getRoutesByCityEmpty()
        {
            var routes = new List<Route>
            {
                new Route
                {
                    Id = 1,
                    Category = "Marathon",
                    Owner = "rocio",
                    Country = "Bolivia",
                    City = "Colcapirhua",
                    Address = "Av.Ballivian",
                    Date = "03/12/2018"
                },
                new Route
                {
                    Id = 2,
                    Category = "Tour",
                    Owner = "roxana",
                    Country = "Bolivia",
                    City = "Cochabamba",
                    Address = "Melchor Perez",
                    Date = "03/12/2018"
                },
            }.AsQueryable();

            var checkpoints = new List<Checkpoint>
            {

            }.AsQueryable();

            var mockSet = new Mock<DbSet<Route>>();
            mockSet.As<IQueryable<Route>>().Setup(m => m.Provider).Returns(routes.Provider);
            mockSet.As<IQueryable<Route>>().Setup(m => m.Expression).Returns(routes.Expression);
            mockSet.As<IQueryable<Route>>().Setup(m => m.ElementType).Returns(routes.ElementType);
            mockSet.As<IQueryable<Route>>().Setup(m => m.GetEnumerator()).Returns(routes.GetEnumerator());


            var mockSet2 = new Mock<DbSet<Checkpoint>>();
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Provider).Returns(checkpoints.Provider);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Expression).Returns(checkpoints.Expression);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.ElementType).Returns(checkpoints.ElementType);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.GetEnumerator()).Returns(checkpoints.GetEnumerator());

            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Routes).Returns(mockSet.Object);
            mockContext.Setup(c => c.Checkpoints).Returns(mockSet2.Object);
            var configuration = new Mock<IConfiguration>();
            var service = new RoutesRepository(mockContext.Object);

            var routesMock = service.GetAllRoutes(null, "La Paz").ToList();
            Assert.AreEqual(0, routesMock.Count);
        }
        [TestMethod]
        public void getRoutesByCityAndCategory()
        {
            var routes = new List<Route>
            {
                new Route
                {
                    Id = 1,
                    Category = "Marathon",
                    Owner = "rocio",
                    Country = "Bolivia",
                    City = "Cochabamba",
                    Address = "Av.Ballivian",
                    Date = "03/12/2018"
                },
                new Route
                {
                    Id = 2,
                    Category = "Tour",
                    Owner = "roxana",
                    Country = "Bolivia",
                    City = "Cochabamba",
                    Address = "Melchor Perez",
                    Date = "03/12/2018"
                },
            }.AsQueryable();

            var checkpoints = new List<Checkpoint>
            {

            }.AsQueryable();

            var mockSet = new Mock<DbSet<Route>>();
            mockSet.As<IQueryable<Route>>().Setup(m => m.Provider).Returns(routes.Provider);
            mockSet.As<IQueryable<Route>>().Setup(m => m.Expression).Returns(routes.Expression);
            mockSet.As<IQueryable<Route>>().Setup(m => m.ElementType).Returns(routes.ElementType);
            mockSet.As<IQueryable<Route>>().Setup(m => m.GetEnumerator()).Returns(routes.GetEnumerator());


            var mockSet2 = new Mock<DbSet<Checkpoint>>();
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Provider).Returns(checkpoints.Provider);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Expression).Returns(checkpoints.Expression);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.ElementType).Returns(checkpoints.ElementType);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.GetEnumerator()).Returns(checkpoints.GetEnumerator());

            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Routes).Returns(mockSet.Object);
            mockContext.Setup(c => c.Checkpoints).Returns(mockSet2.Object);
            var configuration = new Mock<IConfiguration>();
            var service = new RoutesRepository(mockContext.Object);

            var routesMock = service.GetAllRoutes("tour", "Cochabamba").ToList();
            Assert.AreEqual(1, routesMock.Count);
            Assert.AreEqual(2, routesMock[0].Id);
        }
        [TestMethod]
        public void getRoutesByCityAndCategoryEmpty()
        {
            var routes = new List<Route>
            {
                new Route
                {
                    Id = 1,
                    Category = "Marathon",
                    Owner = "rocio",
                    Country = "Bolivia",
                    City = "Colcapirhua",
                    Address = "Av.Ballivian",
                    Date = "03/12/2018"
                },
                new Route
                {
                    Id = 2,
                    Category = "Tour",
                    Owner = "roxana",
                    Country = "Bolivia",
                    City = "Cochabamba",
                    Address = "Melchor Perez",
                    Date = "03/12/2018"
                },
            }.AsQueryable();

            var checkpoints = new List<Checkpoint>
            {

            }.AsQueryable();

            var mockSet = new Mock<DbSet<Route>>();
            mockSet.As<IQueryable<Route>>().Setup(m => m.Provider).Returns(routes.Provider);
            mockSet.As<IQueryable<Route>>().Setup(m => m.Expression).Returns(routes.Expression);
            mockSet.As<IQueryable<Route>>().Setup(m => m.ElementType).Returns(routes.ElementType);
            mockSet.As<IQueryable<Route>>().Setup(m => m.GetEnumerator()).Returns(routes.GetEnumerator());


            var mockSet2 = new Mock<DbSet<Checkpoint>>();
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Provider).Returns(checkpoints.Provider);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Expression).Returns(checkpoints.Expression);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.ElementType).Returns(checkpoints.ElementType);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.GetEnumerator()).Returns(checkpoints.GetEnumerator());

            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Routes).Returns(mockSet.Object);
            mockContext.Setup(c => c.Checkpoints).Returns(mockSet2.Object);
            var configuration = new Mock<IConfiguration>();
            var service = new RoutesRepository(mockContext.Object);

            var routesMock = service.GetAllRoutes("Vaya", "Cochabamba").ToList();
            Assert.AreEqual(0, routesMock.Count);
        }
        [TestMethod]
        public void getAllRoutesByCityAndCategory()
        {
            var routes = new List<Route>
            {
                new Route
                {
                    Id = 1,
                    Category = "Marathon",
                    Owner = "rocio",
                    Country = "Bolivia",
                    City = "Colcapirhua",
                    Address = "Av.Ballivian",
                    Date = "03/12/2018"
                },
                new Route
                {
                    Id = 2,
                    Category = "Tour",
                    Owner = "roxana",
                    Country = "Bolivia",
                    City = "Cochabamba",
                    Address = "Melchor Perez",
                    Date = "03/12/2018"
                },
            }.AsQueryable();

            var checkpoints = new List<Checkpoint>
            {

            }.AsQueryable();

            var mockSet = new Mock<DbSet<Route>>();
            mockSet.As<IQueryable<Route>>().Setup(m => m.Provider).Returns(routes.Provider);
            mockSet.As<IQueryable<Route>>().Setup(m => m.Expression).Returns(routes.Expression);
            mockSet.As<IQueryable<Route>>().Setup(m => m.ElementType).Returns(routes.ElementType);
            mockSet.As<IQueryable<Route>>().Setup(m => m.GetEnumerator()).Returns(routes.GetEnumerator());


            var mockSet2 = new Mock<DbSet<Checkpoint>>();
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Provider).Returns(checkpoints.Provider);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.Expression).Returns(checkpoints.Expression);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.ElementType).Returns(checkpoints.ElementType);
            mockSet2.As<IQueryable<Checkpoint>>().Setup(m => m.GetEnumerator()).Returns(checkpoints.GetEnumerator());

            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Routes).Returns(mockSet.Object);
            mockContext.Setup(c => c.Checkpoints).Returns(mockSet2.Object);
            var configuration = new Mock<IConfiguration>();
            var service = new RoutesRepository(mockContext.Object);

            var routesMock = service.GetAllRoutes(null, null).ToList();
            Assert.AreEqual(2, routesMock.Count);
        }
    }
}
