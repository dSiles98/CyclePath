using CyclepathAPI.CyclepathDataBase;
using CyclepathAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.Repository
{
    public class MessageRepository : ICrud<Message, int>
    {
        protected CyclepathDbContext CyclepathDbContext { get; set; }

        public MessageRepository(CyclepathDbContext cyclepathDbContext)
        {
            this.CyclepathDbContext = cyclepathDbContext;
        }
        public void Create(Message item)
        {
            CheckIfBlocked(item.OwnerId, item.Addressee);
            if(item.Content.Length > 140)
            {
                throw new Exception("too long");
            }
            item.SendTime = DateTime.UtcNow;
            CyclepathDbContext.Messages.Add(item);
            CyclepathDbContext.SaveChanges();
        }

        public void CheckIfBlocked(int origin, int to)
        {
            var block = CyclepathDbContext.Blocks.Where(blocked => blocked.IdOwner == to && blocked.IdBlocked == origin).ToList();
            if(block.ToArray().Length > 0)
            {
                throw new Exception("no one likes you");
            }
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public void Edit(int id, Message item)
        {
            Message message = GetOne(id);
            message.delivered = true;
            CyclepathDbContext.SaveChanges();
        }

        public IEnumerable<Message> GetAll()
        {
            return CyclepathDbContext.Messages.ToList();
        }

        public IEnumerable<Message> GetConversation(int owner, int adressee)
        {
            return CyclepathDbContext.Messages.Where(message => message.OwnerId == owner && message.Addressee == adressee).ToList();
        }

        public Message GetOne(int id)
        {
            return CyclepathDbContext.Messages.Where(message => message.Id == id ).ToList()[0];
        }

        public IEnumerable<Conversation> GetConversations(int owner)
        {
            var messages = CyclepathDbContext.Messages.Where(message => message.Addressee == owner).ToList();
            var conversations = new Dictionary<int, Conversation>();
            foreach (var message in messages)
            {
                var conversation = new Conversation();
                conversation.NoNews = true;
                conversation.AccountId = message.OwnerId;
                conversation.NoNews = message.delivered;
                conversation.AccountUsername = CyclepathDbContext.Accounts.Where(account => account.Id == message.OwnerId).ToList()[0].Username;
                try
                {
                    conversations.Add(message.OwnerId, conversation);
                }
                catch (Exception)
                {
                    conversations[message.OwnerId].NoNews &= message.delivered;
                }
            }
            
            return conversations.Values;
        }
    }
}
