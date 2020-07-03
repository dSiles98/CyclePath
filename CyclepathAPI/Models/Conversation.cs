using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CyclepathAPI.Models
{
    public class Conversation
    {
        public string AccountUsername { get; set; }
        public int AccountId { get; set; }
        public bool NoNews { get; set; }
    }
}
