using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace ChatMvcSignalR
{
    public class ChatHub : Hub
    {
        private static List<User> _usernameList = new List<User>();
        public static int _userCount = 0;


        public void Login(string username)
        {
            string id = Context.ConnectionId;
            _usernameList.Add(new User(){ SetId = id, Name = username });
            UpdateUserList();
            PushMessageReciever("gick med i chatten:",username );

        }
        public void Hello(string username)
        {
            Clients.All.hello(username);
        }

        public void PushMessageReciever( string message, string username)
        {
            Clients.Others.msgReciever(message, username, DateTime.Now.ToString("HH:mm:ss"));
        }
        public void PushMessagePrivate(string message, string username, string id)
        {
            Clients.Client(id).msgPriv(message, username, DateTime.Now.ToString("HH:mm:ss"));
        }
        public void PushMessageCaller(string message, string username )
        {
            Clients.Caller.msgCaller(message, username, DateTime.Now.ToString("HH:mm:ss"));
        }
        public void UpdateUserList()
        {
            Clients.All.userList(_usernameList);
        }

        public override Task OnConnected()
        {
            _userCount++;
            Clients.All.msgReciever(Context.ConnectionId);

            return base.OnConnected();
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            _userCount--;
            var user = _usernameList.First(x => x.SetId == Context.ConnectionId);
            var context = GlobalHost.ConnectionManager.GetHubContext<ChatHub>();
            _usernameList.Remove(user);
            context.Clients.All.online(_userCount);
            Clients.All.msgReciever(" disconnected", user.Name, "User ");
            UpdateUserList();
            return base.OnDisconnected(stopCalled);
        }


    }
}