using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace CyclepathAPI.Models
{
    public class Json
    {
        /// <summary>
        /// This method allow serialize the object and manage his attributes.
        /// </summary>
        /// <param name="obj">object to manage</param>
        /// <param name="includeEverything">bool</param>
        /// <param name="args">List of arguments to validate</param>
        /// <returns>object</returns>
        public Account Serialize(object obj, bool includeEverything, List<string> args)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings();
            settings.Formatting = Formatting.Indented;
            if (includeEverything)
            {
                settings.ContractResolver = new IgnoreJsonAttributesResolver(args);
            }
            string result = JsonConvert.SerializeObject(obj, settings);
            Account objct = JsonConvert.DeserializeObject<Account>(result);
            return objct;
        }

    }

    public class IgnoreJsonAttributesResolver : DefaultContractResolver
    {
        private List<string> options;
        public IgnoreJsonAttributesResolver(List<string> args)
        {
            this.options = args;
        }

        /// <summary>
        /// This Method allow changes the status of attribute.
        /// </summary>
        /// <param name="type"></param>
        /// <param name="memberSerialization"></param>
        /// <returns>JsonPropeties IList</returns>
        protected override IList<JsonProperty> CreateProperties(Type type, MemberSerialization memberSerialization)
        {
            IList<JsonProperty> props = base.CreateProperties(type, memberSerialization);
            foreach (var prop in props)
            {
                foreach (var current in options)
                {
                    bool verified = verifyProperty(prop, options);
                    if (verified)
                    {
                        prop.Ignored = true;
                    }
                    else
                    {
                        prop.Ignored = false;   // Ignore [JsonIgnore]
                    }
                }
            }
            return props;
        }

        /// <summary>
        /// This method Verified that the JsonProperty is equals to any argument in the list.
        /// </summary>
        /// <param name="prop">JsonProperty</param>
        /// <param name="args">List of arguments to verify</param>
        /// <returns>bool</returns>
        public bool verifyProperty(JsonProperty prop, List<string> args)
        {
            bool result = false;
            foreach (var current in args)
            {
                if (current == prop.PropertyName)
                {
                    result = true;
                }
            }
            return result;
        }
    }
}
