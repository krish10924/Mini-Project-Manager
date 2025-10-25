using System.ComponentModel.DataAnnotations;

namespace ProjectManagement.DTOs
{
    public class TaskCreateDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        [Required]
        public int ProjectId { get; set; }
    }
}
