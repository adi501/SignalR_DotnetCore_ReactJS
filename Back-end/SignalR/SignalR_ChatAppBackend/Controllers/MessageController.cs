using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalR_ChatAppBackend.Dtos;

namespace SignalR_ChatAppBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public MessageController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        public IActionResult Post([FromBody] MessageDto message)
        {
            _hubContext.Clients.All.SendAsync("ReceiveMessage", message.User, message.Message);
            return Ok();
        }
    }
}
