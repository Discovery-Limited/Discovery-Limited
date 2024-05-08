

describe('populateForm' , () => {
    test('should populate the form with the task details', async ({ page }) => {
        const answer = populateForm(
            1,
            'Sample Task',
            'Sample Description',
            'Sample deadline',
            'sample tag',
            'red'
        );
        console.log(answer);
        expect(answer).toBe(true);
    });
})