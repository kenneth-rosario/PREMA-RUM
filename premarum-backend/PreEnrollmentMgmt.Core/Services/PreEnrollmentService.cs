using PreEnrollmentMgmt.Core.Entities;
using PreEnrollmentMgmt.Core.Exceptions;
using PreEnrollmentMgmt.Core.Repositories;

namespace PreEnrollmentMgmt.Core.Services;

public class PreEnrollmentService
{
    private readonly IPreEnrollmentRepository _preEnrollmentRepository;
    private readonly ISemesterOfferRepository _semesterOfferRepository;
    private readonly IStudentRepository _studentRepository;
    private readonly StudentValidationService _studentValidationService;

    public PreEnrollmentService(IPreEnrollmentRepository preEnrollmentRepository,
        ISemesterOfferRepository semesterOfferRepository, IStudentRepository studentRepository,
        StudentValidationService studentValidationService)
    {
        _preEnrollmentRepository = preEnrollmentRepository;
        _semesterOfferRepository = semesterOfferRepository;
        _studentRepository = studentRepository;
        _studentValidationService = studentValidationService;
    }

    public async Task<IEnumerable<SemesterOffer>> AddSelectionToPreEnrollment(int preEnrollmentId, string studentEmail,
        int[] courseOfferings)
    {
        if (courseOfferings is {Length: > 5})
            throw new InvalidPreEnrollmentSelectionException("Cannot insert more than 5 selections at a time");

        var preEnrollment = await _preEnrollmentRepository.GetByIdWithSemesterOffersSimple(preEnrollmentId);
        
        if( ! await _studentValidationService.ValidateStudentCanModify(studentEmail, preEnrollment.StudentId))
            throw new InvalidPreEnrollmentSelectionException("Student cannot change PreEnrollment");
        
        if (preEnrollment == null)
            throw new InvalidPreEnrollmentSelectionException("PreEnrollment Not Found");

        var semesterOffers = await _semesterOfferRepository.GetByIdList(courseOfferings);

        if (semesterOffers.Count() < courseOfferings.Length)
            throw new InvalidPreEnrollmentSelectionException("Some selected course offerings to add do not exist");

        foreach (var semesterOffer in semesterOffers)
        {
            preEnrollment.ValidateSelection(semesterOffer);
            preEnrollment.AddSelection(semesterOffer);
        }

        _preEnrollmentRepository.Save(preEnrollment);
        return semesterOffers;
    }
    
    public async Task<string> RemoveSelectionFromPreEnrollment(int preEnrollmentId, string studentEmail,
        int[] courseOfferings)
    {
        if (courseOfferings is {Length: > 5})
            throw new InvalidPreEnrollmentSelectionException("Cannot remove more than 5 selections at a time");

        var preEnrollment = await _preEnrollmentRepository.GetByIdWithSemesterOffersSimple(preEnrollmentId);

        if (preEnrollment == null)
            throw new InvalidPreEnrollmentSelectionException("PreEnrollment Not Found");
        
        if( ! await _studentValidationService.ValidateStudentCanModify(studentEmail, preEnrollment.StudentId))
            throw new InvalidPreEnrollmentSelectionException("Student cannot change PreEnrollment");

        if (preEnrollment.Selections.Count < courseOfferings.Length)
            throw new InvalidPreEnrollmentSelectionException("Cannot remove more selections than what are available");

        foreach (var semesterOffer in preEnrollment.Selections)
        {
            if(courseOfferings.Contains(semesterOffer.Id))
                preEnrollment.RemoveSelection(semesterOffer);
        }
        _preEnrollmentRepository.Save(preEnrollment);
        return "200 OK";
    }

    public async Task<IEnumerable<PreEnrollment>> GetStudentPreEnrollments(string studentEmail)
    {
        var student = await _studentRepository.GetByEmailSimple(studentEmail);
        if (student == null)
            throw new StudentNotFoundException("No student found with specified email");
        var preEnrollments = await _preEnrollmentRepository
            .GetByStudentIdComplete(student.Id);
        return preEnrollments;
    }
}