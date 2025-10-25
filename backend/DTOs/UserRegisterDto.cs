using System.ComponentModel.DataAnnotations;

namespace ProjectManagement.DTOs
{
    public class UserRegisterDto
    {
        [Required, MinLength(3)]
        public string Username { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }
}
