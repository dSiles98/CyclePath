
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
    public class AccountTest
    {
        [TestMethod]
        public void getUsers()
        {
            var users = new List<Account>
            {
                new Account
                {
                    Id = 1,
                    Username = "jp",
                    Password = "123",
                    Name = "Juan",
                    Lastname = "Perez",
                    Birthday = "01/12/18",
                    Email = "roxie9731@gmail.com"
                },
                new Account
                {
                    Id = 1,
                    Username = "ps",
                    Password = "123",
                    Name = "Pablo",
                    Lastname = "Suarez",
                    Birthday = "01/12/18",
                    Email = "roxie9731@gmail.com"
                },
            }.AsQueryable();
            var mockSet = new Mock<DbSet<Account>>();
            //mockSet.As<IQueryable<Account>>().Setup(m => m.Provider).Returns(users.Provider);
            //mockSet.As<IQueryable<Account>>().Setup(m => m.Expression).Returns(users.Expression);
            // mockSet.As<IQueryable<Account>>().Setup(m => m.ElementType).Returns(users.ElementType);
            mockSet.As<IQueryable<Account>>().Setup(m => m.GetEnumerator()).Returns(users.GetEnumerator());
            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Accounts).Returns(mockSet.Object);
            var configuration = new Mock<IConfiguration>();
            var service = new AccountRepository(mockContext.Object, configuration.Object);
            var accountsMock = service.GetAll().ToList();
            Assert.AreEqual(2, accountsMock.Count);
            Assert.AreEqual("Juan", accountsMock[0].Name);
            Assert.AreEqual("roxie9731@gmail.com", accountsMock[1].Email);
        }
        [TestMethod]
        public void getOneUser()
        {
            var users = new List<Account>
            {
                new Account
                {
                    Id = 1,
                    Username = "jp",
                    Password = "123",
                    Name = "Juan",
                    Lastname = "Perez",
                    Birthday = "01/12/18",
                    Email = "roxie9731@gmail.com"
                },
                new Account
                {
                    Id = 1,
                    Username = "ps",
                    Password = "123",
                    Name = "Pablo",
                    Lastname = "Suarez",
                    Birthday = "01/12/18",
                    Email = "roxie9731@gmail.com"
                },
            }.AsQueryable();
            var mockSet = new Mock<DbSet<Account>>();
            mockSet.As<IQueryable<Account>>().Setup(m => m.Provider).Returns(users.Provider);
            mockSet.As<IQueryable<Account>>().Setup(m => m.Expression).Returns(users.Expression);
            mockSet.As<IQueryable<Account>>().Setup(m => m.GetEnumerator()).Returns(users.GetEnumerator());
            var mockContext = new Mock<CyclepathDbContext>();
            mockContext.Setup(c => c.Accounts).Returns(mockSet.Object);
            var configuration = new Mock<IConfiguration>();
            var service = new AccountRepository(mockContext.Object, configuration.Object);
            Account user1 = service.GetOne("ps");
            Assert.AreEqual("ps", user1.Username);
        }
    }
}
