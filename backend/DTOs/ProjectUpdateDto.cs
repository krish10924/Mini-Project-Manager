using System.ComponentModel.DataAnnotations;

namespace ProjectManagement.DTOs
{
    public class ProjectUpdateDto
    {
        [ MinLength(3), MaxLength(100)]
        public string? Title { get; set; } 

        [MaxLength(500)]
        public string? Description { get; set; }
    }
}
