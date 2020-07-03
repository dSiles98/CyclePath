using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.Repository
{
    public class FriendsListRepository
    {
        protected CyclepathDbContext CyclepathDbContext { get; set; }

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="cyclepathDbContext">Database</param>
        public FriendsListRepository(CyclepathDbContext cyclepathDbContext)
        {
            this.CyclepathDbContext = cyclepathDbContext;
        }


        public void Create(FriendList friends)
        {
            bool verifiedExist = VerifyNames(friends.IdFriend);
            bool verifiedFriendship = VerifyFriendship(friends);
            if (verifiedExist && !verifiedFriendship)
            {
                CyclepathDbContext.Friends.Add(friends);
                CyclepathDbContext.SaveChanges();
            }
            else
            {
                throw new Exception("Friend can not be added or it's already on your friend list");
            }
        }
        
        public FriendList GetOne(int id)
        {
            var friends = CyclepathDbContext.Friends.Where(friend => friend.Id == id).ToList();
            return friends[0];
        }

        public void Delete(FriendList friends)
        {
            FriendList verifiedFriendship = GetFrienship(friends);
            if (verifiedFriendship != null)
            {
                CyclepathDbContext.Friends.Remove(verifiedFriendship);
                CyclepathDbContext.SaveChanges();
            }
            else
                throw new Exception("Friend can not be deleted or it's not on your friend list");
        }

        public IEnumerable<FriendList> GetAll(string id)
        {
            var friends = CyclepathDbContext.Friends.Where(friend => friend.IdOwner == id).ToList();
            return friends;
        }

        public void Edit(int id, FriendList account)
        {
            throw new NotImplementedException();
        }

        private bool VerifyNames(string user)
        {
            bool result = false;
            foreach (Account account in CyclepathDbContext.Accounts)
            {
                if (account.Username == user)
                {
                    result = true;
                    break;
                }
            }
            return result;
        }

        private bool VerifyFriendship(FriendList friends)
        {
            bool result = false;
            var friendship = CyclepathDbContext.Friends.Where(friend => friend.IdOwner == friends.IdOwner).ToList();
            foreach (var friend in friendship)
            {
                if (friend.IdFriend == friends.IdFriend)
                {
                    result = true;
                    break;
                }
            }
            return result;
        }

        private FriendList GetFrienship(FriendList friends)
        {
            FriendList result = null;
            var friendship = CyclepathDbContext.Friends.Where(friend => friend.IdOwner == friends.IdOwner).ToList();
            foreach (FriendList friend in friendship)
            {
                if (friend.IdFriend == friends.IdFriend)
                {
                    return friend;
                }
            }
            return result;
        }
        public void Update(string id, FriendList account)
        {
            throw new NotImplementedException();
        }

        public void Delete(string id)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<FriendList> GetAll()
        {
            throw new NotImplementedException();
        }
    }
}
