using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using CyclepathAPI.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;
using System.Linq;

namespace CyclepathTest
{
    [TestClass]
    public class BikeTest
    {
        private BikeRepository bikeRepository;

        private CyclepathDbContext dataBase;
        public BikeTest()
        {
            var builder = new DbContextOptionsBuilder<CyclepathDbContext>();
            builder.UseInMemoryDatabase();
            var options = builder.Options;
            dataBase = new CyclepathDbContext(options);
            bikeRepository = new BikeRepository(dataBase);
        }

        [TestMethod]
        public void GetAllBikesTest()
        {
            var bikes = new List<Bike>
            {
                new Bike
                {
                    Id = 1,
                    Description = "Montain",
                    Price = 20,
                    Disponible = true,
                    Image = "123456",
                    RentPointId = 1
                },
                new Bike
                {
                    Id = 2,
                    Description = "Street",
                    Price = 25,
                    Disponible = true,
                    Image = "1234",
                    RentPointId = 1
                },
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Bike>>();
            mockSet.As<IQueryable<Bike>>().Setup(m => m.Provider).Returns(bikes.Provider);
            mockSet.As<IQueryable<Bike>>().Setup(m => m.Expression).Returns(bikes.Expression);
            mockSet.As<IQueryable<Bike>>().Setup(m => m.ElementType).Returns(bikes.ElementType);
            mockSet.As<IQueryable<Bike>>().Setup(m => m.GetEnumerator()).Returns(bikes.GetEnumerator());

            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Bikes).Returns(mockSet.Object);

            var service = new BikeRepository(mockContext.Object);
            var bikesMock = service.GetAll().ToList();

            Assert.AreEqual(2, bikesMock.Count);
            Assert.AreEqual("Montain", bikesMock[0].Description);
            Assert.AreEqual("Street", bikesMock[1].Description);
        }

        [TestMethod]
        public void GetOneBikeTest()
        {
            var bikes = new List<Bike>
            {
                new Bike
                {
                    Id = 1,
                    Description = "Montain",
                    Price = 20,
                    Disponible = true,
                    Image = "123456",
                    RentPointId = 1
                },
                new Bike
                {
                    Id = 2,
                    Description = "Street",
                    Price = 25,
                    Disponible = true,
                    Image = "1234",
                    RentPointId = 1
                },
            }.AsQueryable();
            var mockSet = new Mock<DbSet<Bike>>();

            mockSet.As<IQueryable<Bike>>().SetupGet(m => m.Provider).Returns(bikes.Provider);
            mockSet.As<IQueryable<Bike>>().SetupGet(m => m.Expression).Returns(bikes.Expression);
            mockSet.As<IQueryable<Bike>>().SetupGet(m => m.ElementType).Returns(bikes.ElementType);
            mockSet.As<IQueryable<Bike>>().Setup(m => m.GetEnumerator()).Returns(bikes.GetEnumerator());
            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Bikes).Returns(mockSet.Object);

            var service = new BikeRepository(mockContext.Object);
            Bike bike = service.GetOne(2);
            var expected = bikes.ToList()[1];
            Assert.AreEqual(expected.Description, bike.Description);
        }

        [TestMethod]
        public void GetRentpointTest()
        {
            var bikes = new List<Bike>
            {
                new Bike
                {
                    Id = 1,
                    Description = "Montain",
                    Price = 20,
                    Disponible = true,
                    Image = "123456",
                    RentPointId = 1
                },
                new Bike
                {
                    Id = 2,
                    Description = "Street",
                    Price = 25,
                    Disponible = true,
                    Image = "1234",
                    RentPointId = 1
                },
                new Bike
                {
                    Id = 2,
                    Description = "Garden",
                    Price = 30,
                    Disponible = true,
                    Image = "25649",
                    RentPointId = 2
                },
            }.AsQueryable();
            var mockSet = new Mock<DbSet<Bike>>();

            mockSet.As<IQueryable<Bike>>().SetupGet(m => m.Provider).Returns(bikes.Provider);
            mockSet.As<IQueryable<Bike>>().SetupGet(m => m.Expression).Returns(bikes.Expression);
            mockSet.As<IQueryable<Bike>>().SetupGet(m => m.ElementType).Returns(bikes.ElementType);
            mockSet.As<IQueryable<Bike>>().Setup(m => m.GetEnumerator()).Returns(bikes.GetEnumerator());
            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Bikes).Returns(mockSet.Object);

            var service = new BikeRepository(mockContext.Object);

            var rentPoints = service.GetRentPointBikes(1).ToList();

            Assert.AreEqual(2, rentPoints.Count);
            Assert.AreEqual("Montain", rentPoints[0].Description);
            Assert.AreEqual("Street", rentPoints[1].Description);
        }

        [TestMethod]
        public void TestAddBike()
        {
            Bike bike = new Bike
            {
                Id = 1,
                Description = "Montain",
                Price = 20,
                Disponible = true,
                Image = "123456",
                RentPointId = 1
            };
            bikeRepository.Create(bike);
            Assert.AreEqual(1, bikeRepository.Count());
        }

        [TestMethod]
        public void TestDeleteBike()
        {
            Bike bike = new Bike
            {
                Id = 2,
                Description = "Montain",
                Price = 20,
                Disponible = true,
                Image = "123456",
                RentPointId = 2
            };
            Bike bike2 = new Bike
            {
                Id = 3,
                Description = "Street",
                Price = 25,
                Disponible = true,
                Image = "1234567",
                RentPointId = 3
            };
            bikeRepository.Create(bike);
            bikeRepository.Create(bike2);
            Assert.AreEqual(3, bikeRepository.Count());
            bikeRepository.Delete(1);
            Assert.AreEqual(2, bikeRepository.Count());
        }
    }
}
