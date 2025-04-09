// separador de instrucciones
export const parseInstructions = (instructions: string): string[] => {
  const hasNumberedSteps = /^\d+\.\s+/m.test(instructions);

  if (hasNumberedSteps) {
    return instructions
      .split(/^\d+\.\s+/gm)
      .filter(step => step.trim() !== "")
      .map(step => step.trim().replace(/\.$/, '') + '.');
  } else {
    return instructions
      .split(/\r\n|\n|\r|\./)
      .filter(step => step.trim() !== "")
      .map(step => step.trim().replace(/\.$/, '') + '.');
  }
};
