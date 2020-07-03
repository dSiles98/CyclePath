using CyclepathAPI.Controllers;
using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.JsonPatch;

namespace CyclepathAPI.Repository
{
    public class AccountRepository: ICrud< Account, string >
    {
        protected CyclepathDbContext CyclepathDbContext { get; set; }
        private SmtpClient smtp;
        public IConfiguration Configuration { get; }
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cyclepathDbContext">Database</param>
        public AccountRepository(CyclepathDbContext cyclepathDbContext, IConfiguration configuration)
        {
            Configuration = configuration;
            CyclepathDbContext = cyclepathDbContext;
            smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                Credentials = new NetworkCredential("cyclepath.app123@gmail.com", "Admin123*"),
                EnableSsl = true
            };
        }

        /// <summary>
        /// This method allow cretate a new account.
        /// </summary>
        /// <param name="user">this is the class user</param>
        public void Create(Account user)
        {
            string verified = VerifyUser(user);
            if (String.IsNullOrEmpty(verified))
            {
                user.EmailVerified = false;
                CyclepathDbContext.Accounts.Add(user);
                CyclepathDbContext.SaveChanges();
                SendVerificationEmail(user.Email, user.Username);
            }
            else
            {
                throw new Exception($"{verified}");
            }
        }

        private void SendVerificationEmail(string email, string username)
        {
            string url = ConfigurationExtensions.GetConnectionString(Configuration, "apiurl");
            MailMessage message = new MailMessage();
            message.To.Add(new MailAddress(email, "Request for verification"));
            message.From = (new MailAddress("cyclepath.app123@gmail.com"));
            message.Body = "<p>Congratulations now you are member of the most popular bike community Cyclepath <br><a href=" + url + "account/verifyemail/" + username + ">click here to verify your email </a>";
            message.IsBodyHtml = true;
            message.Subject = "Verification Email";
            smtp.Send(message);
        }

        /// <summary>
        /// This method verified that can be users with the same username.
        /// </summary>
        /// <param name="user">user class to verified</param>
        /// <returns></returns>
        private string VerifyUser(Account user)
        {
            var userAccount = CyclepathDbContext.Accounts.Where(account => account.Email == user.Email || account.Username == user.Username);
            if (userAccount.Any())
            {
                if (userAccount.First().Username == user.Username)
                {
                    return $"The Username: {user.Username} already exists";
                }
                if (userAccount.First().Email == user.Email)
                {
                    return $"The Email: {user.Email} already exists ";
                }
            }
            return String.Empty;
        }

        /// <summary>
        /// This method looking for user by username.
        /// </summary>
        /// <param name="username">username required to seek</param>
        /// <returns></returns>
        public Account GetOne(string username)
        {
            var result = CyclepathDbContext.Accounts.Where(account => account.Username == username);
            if (result.Any())
            {
                return result.First();
            }
            return null;
        }

        /// <summary>
        /// This method looking for user by username.
        /// </summary>
        /// <param name="username">username required to seek</param>
        /// <returns></returns>
        public Account GetOneByID(int id)
        {
            Account result = null;
            foreach (Account account in CyclepathDbContext.Accounts)
            {
                if (account.Id == id)
                {
                    result = account;
                    break;
                }
            }
            return result;
        }

        public void EditPassword(string username, string password)
        {
            Account account = GetOne(username);
            account.Password = password;
            CyclepathDbContext.SaveChanges();
        }

        /// <summary>
        /// This method Allow to seek a user and edit it.
        /// </summary>
        /// <param name="user">username to seek a user</param>
        /// <param name="item">new changes for the user</param>
        public void Edit(string user, Account item)
        {
            Account account = GetOne(user);
            if (account != null)
            {
                account.Username = VerifiyField(account.Username, item.Username);
                account.Name = VerifiyField(account.Name, item.Name);
                account.Lastname = VerifiyField(account.Lastname, item.Lastname);
                account.Birthday = VerifiyField(account.Birthday, item.Birthday);
                account.Email = VerifiyField(account.Email, item.Email);
                CyclepathDbContext.SaveChanges();
            }
            else
            {
                throw new Exception("Cannot edit that account");
            }
        }

        /// <summary>
        /// This method allow to seek a user and delete it.
        /// </summary>
        /// <param name="user">username required to delete</param>
        public void Delete(string user)
        {
            Account account = GetOne(user);
            if (account != null)
            {
                RemoveReferencesOfTheAccount(account);
                CyclepathDbContext.Accounts.Remove(account);
                CyclepathDbContext.SaveChanges();
            }
            else
            {
                throw new Exception("Cannot delete that account");
            }
        }

        private void RemoveReferencesOfTheAccount(Account account)
        {
            var rentPoints = CyclepathDbContext.RentPoints.Where(rentPoint => rentPoint.OwnerId == account.Id);
            var events = CyclepathDbContext.Events.Where(eventCycle => eventCycle.OwnerId == account.Id);
            var ownerFriends = CyclepathDbContext.Friends.Where(friend => friend.IdOwner == account.Username);
            var friends = CyclepathDbContext.Friends.Where(friend => friend.IdFriend == account.Username);
            var ownerBlocks = CyclepathDbContext.Blocks.Where(block => block.IdOwner == account.Id);
            var blocks = CyclepathDbContext.Blocks.Where(block => block.IdBlocked == account.Id);
            var ownerEnlistment = CyclepathDbContext.Enlistments.Where(assist => assist.IdAccount == account.Id);
            Delete(rentPoints);
            Delete(events);
            Delete(ownerFriends);
            Delete(friends);
            Delete(ownerBlocks);
            Delete(blocks);
            Delete(ownerEnlistment);
            foreach (var rentPoint in rentPoints)
            {
                var bikes = CyclepathDbContext.Bikes.Where(bike => bike.RentPointId == rentPoint.Id);
                Delete(bikes);
            }
            var routes = CyclepathDbContext.Routes.Where(route => route.Owner == account.Username).ToList();
            Delete(routes);
            foreach (var route in routes)
            {
                var checkpoints = CyclepathDbContext.Checkpoints.Where(checkpoint => checkpoint.RouteId == route.Id);
                Delete(checkpoints);
            }
            foreach (var cyclePathEvent in events)
            {
                var enlistment = CyclepathDbContext.Enlistments.Where(assist => assist.IdEvent == cyclePathEvent.Id);
                Delete(enlistment);
            }
        }

        private void Delete<T>(IEnumerable<T> objects) where T: class
        {
            foreach (T item in objects)
            {
                CyclepathDbContext.Set<T>().Remove(item);
            }
        }

        /// <summary>
        /// This method allow verified the fields for the user.
        /// </summary>
        /// <param name="currentField">current data</param>
        /// <param name="field">data to replace</param>
        /// <returns></returns>
        private string VerifiyField(string currentField, string field)
        {
            string result = field;
            if (string.IsNullOrWhiteSpace(field))
            {
                result = currentField;
            }
            return result;
        }

        internal void Patch(Account account, JsonPatchDocument<Account> newAccount)
        {
            newAccount.ApplyTo(account);
            CyclepathDbContext.SaveChanges();
        }

        /// <summary>
        /// This method returns the accounts from data base.
        /// </summary>
        /// <returns></returns>
        public IEnumerable<Account> GetAll()
        {
            var accounts = CyclepathDbContext.Accounts.ToList();
            return accounts;
        }

        /// <summary>
        /// this method verify the email of a user
        /// </summary>
        /// <param name="username"></param>
        public void VerifyEmail(string username)
        {
            Account account = GetOne(username);
            if (account != null)
            {
                account.EmailVerified = true;
                CyclepathDbContext.SaveChanges();
            }
            else
            {
                throw new Exception("User Not Found");
            }
        }

        /// <summary>
        /// this method recover send a email with a new password
        /// </summary>
        /// <param name="username"></param>
        public void RecoverPassword(string username)
        {
            Account user = GetOne(username);
            if (user.EmailVerified)
            {
                string newPassword = GenerateNewPassword();
                string hashedNewPassword = AccountController.CreateHash(newPassword);
                EditPassword(username, hashedNewPassword);
                MailMessage message = new MailMessage();
                message.To.Add(new MailAddress(user.Email, "Request For Password Recovery"));
                message.From = (new MailAddress("cyclepath.app123@gmail.com"));
                message.Body = "<p> Your temporary password is <br><h2>" + newPassword + "</h2><br><p>Change your password once you login in to the app";
                message.IsBodyHtml = true;
                message.Subject = "Password Recovery";
                smtp.Send(message);
            }
        }

        /// <summary>
        /// this method generates a new password of 8 keys
        /// </summary>
        /// <returns></returns>
        private string GenerateNewPassword()
        {
            Random random = new Random();
            string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, 8).Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
