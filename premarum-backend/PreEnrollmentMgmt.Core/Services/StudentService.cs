using PreEnrollmentMgmt.Core.Entities;
using PreEnrollmentMgmt.Core.Exceptions;
using PreEnrollmentMgmt.Core.Repositories;

namespace PreEnrollmentMgmt.Core.Services;

public class StudentService
{
    
    private readonly IStudentRepository _studentRepository;
    private readonly StudentValidationService _studentValidationService;

    public StudentService( IStudentRepository studentRepository,
        StudentValidationService studentValidationService)
    {
        _studentRepository = studentRepository;
        _studentValidationService = studentValidationService;
    }

    public async Task<Student> GetOrCreateStudent(string studentEmail)
    {
        Student? student;
        student = await _studentRepository.GetByEmailSimple(studentEmail);
        if (student == null)
        {
            student = new Student(studentEmail);
            await _studentRepository.Create(student);
        }
        return student;
    }
    public async Task UpdateDepartment(string studentEmail, int newDepartmentId)
    {
        var student = await _studentValidationService.ValidateStudentExists(studentEmail);
        student.DepartmentId = newDepartmentId;
        _studentRepository.Save(student);
    }
}