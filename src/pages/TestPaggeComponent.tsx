interface PageProps extends DefinedProps {
    changeStateVariables: (newStateVariables: StateVariables) => void;
  }
  
  const TestPageComponent: React.FC<PageProps> = ({
    pageStep,
    page,
    introText,
    infoText1,
    infoText2,
    prompt,
    destination,
    travelDate,
    startTime,
    endTime,
    createButtonText,
    nextButtonText,
    changeStateVariables,
  }) => {
    const handleButtonClick = () => {
      // Example of updating the state when the button is clicked
      const newStateVariables = {
        ...stateVariables,
        destination: "New York",
      };
      changeStateVariables(newStateVariables);
    };
  
    return (
      <div>
        <h1>{page}</h1>
        <p>{introText}</p>
        <p>{infoText1}</p>
        <p>{infoText2}</p>
        <p>{prompt}</p>
        <p>Destination: {destination}</p>
        <p>Travel Date: {travelDate.toISOString()}</p>
        <p>Start Time: {startTime.toISOString()}</p>
        <p>End Time: {endTime.toISOString()}</p>
        <button onClick={handleButtonClick}>{createButtonText}</button>
        <button>{nextButtonText}</button>
      </div>
    );
  };
  
  
  export default TestPageComponent
  
  
  