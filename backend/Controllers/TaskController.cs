using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectManagement.Data;
using ProjectManagement.DTOs;
using ProjectManagement.Models;
using System.Security.Claims;

namespace ProjectManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("project/{projectId}")]
        public async Task<IActionResult> GetTasks(int projectId)
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);

            var project = await _context.Projects
                .Include(p => p.Tasks)
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
                return NotFound("Project not found or not owned by user");

            return Ok(project.Tasks);
        }

        [HttpPost]
public async Task<IActionResult> AddTask(TaskCreateDto dto)
{
    try
    {
        var userId = int.Parse(User.FindFirst("id")!.Value);

        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == dto.ProjectId && p.UserId == userId);

        if (project == null)
            return NotFound("Project not found or not owned by user");

        var task = new TaskItem
        {
            Title = dto.Title,
            DueDate = dto.DueDate,
            ProjectId = dto.ProjectId
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTasks), new { projectId = dto.ProjectId }, task);
    }
    catch (Exception ex)
    {
        return StatusCode(500, ex.Message);
    }
}


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TaskUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);

            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project!.UserId == userId);

            if (task == null)
                return NotFound("Task not found or not owned by user");

            task.Title = dto.Title ?? task.Title;
            task.DueDate = dto.DueDate ?? task.DueDate;
            task.IsCompleted = dto.IsCompleted ?? task.IsCompleted;

            await _context.SaveChangesAsync();
            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);

            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == id && t.Project!.UserId == userId);

            if (task == null)
                return NotFound("Task not found or not owned by user");

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
