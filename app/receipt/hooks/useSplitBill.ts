import { useState } from "react";
import { ReceiptData } from "@/types/receipt";

export const useSplitBill = (data: ReceiptData["data"]) => {
  const [splitBillStep, setSplitBillStep] = useState(0);
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [people, setPeople] = useState<string[]>([]);
  const [itemAssignments, setItemAssignments] = useState<{
    [key: string]: string[];
  }>({});
  const [splitBillResult, setSplitBillResult] = useState<{
    [key: string]: number;
  }>({});
  const [duplicateNameError, setDuplicateNameError] = useState<string | null>(
    null
  );
  const [itemAssignmentError, setItemAssignmentError] = useState<string | null>(
    null
  );

  const handleSplitBill = () => {
    setSplitBillStep(1);
    setNumberOfPeople(2);
    setPeople([]);
    setItemAssignments({});
    setSplitBillResult({});
  };

  const handleCancelSplitBill = () => {
    setSplitBillStep(0);
    setNumberOfPeople(2);
    setPeople([]);
    setItemAssignments({});
    setSplitBillResult({});
  };

  const handleNextStep = () => {
    if (splitBillStep === 1) {
      setPeople(Array(numberOfPeople).fill(""));
      setSplitBillStep(2);
    } else if (splitBillStep === 2) {
      if (people.some((name) => name.trim() === "")) {
        setDuplicateNameError("All name fields must be filled out.");
        return;
      }
      if (new Set(people).size !== people.length) {
        setDuplicateNameError("Each person must have a unique name.");
        return;
      }
      setDuplicateNameError(null);
      setSplitBillStep(3);
    } else if (splitBillStep === 3) {
      const totalItems = data.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      if (Object.keys(itemAssignments).length !== totalItems) {
        setItemAssignmentError(
          "All items must be assigned to at least one person."
        );
        return;
      }
      if (
        Object.values(itemAssignments).some(
          (assignments) => assignments.length === 0
        )
      ) {
        setItemAssignmentError(
          "All items must be assigned to at least one person."
        );
        return;
      }
      setItemAssignmentError(null);
      calculateSplitBill();
      setSplitBillStep(4);
    }
  };

  const handlePreviousStep = () => {
    if (splitBillStep === 4) {
      setSplitBillStep(3);
    } else {
      setSplitBillStep(splitBillStep - 1);
    }
  };

  const handlePersonNameChange = (index: number, name: string) => {
    const newPeople = [...people];
    newPeople[index] = name;
    setPeople(newPeople);
    setDuplicateNameError(null);
  };

  const handleItemAssignment = (itemId: string, selectedPeople: string[]) => {
    setItemAssignments((prev) => ({
      ...prev,
      [itemId]: selectedPeople,
    }));
    setItemAssignmentError(null);
  };

  const calculateSplitBill = () => {
    const result: { [key: string]: number } = {};
    people.forEach((person) => (result[person] = 0));

    data.items.forEach((item, itemIndex) => {
      for (let i = 0; i < item.quantity; i++) {
        const assignmentKey = `${item.name}-${itemIndex}-${i}`;
        const assignedPeople = itemAssignments[assignmentKey] || [];
        if (assignedPeople.length > 0) {
          const itemTotal =
            item.price +
            item.modifiers.reduce((sum, mod) => sum + mod.price, 0);
          const splitAmount = itemTotal / assignedPeople.length;
          assignedPeople.forEach((person) => {
            result[person] += splitAmount;
          });
        }
      }
    });

    const totalAssigned = Object.values(result).reduce(
      (sum, value) => sum + value,
      0
    );

    const taxRatio = data.taxesAndFees / totalAssigned;
    Object.keys(result).forEach((person) => {
      const personAmount = result[person];
      const personTax = personAmount * taxRatio;
      result[person] = Math.round(personAmount + personTax);
    });

    setSplitBillResult(result);
  };

  return {
    splitBillStep,
    numberOfPeople,
    people,
    itemAssignments,
    splitBillResult,
    duplicateNameError,
    itemAssignmentError,
    handleSplitBill,
    handleCancelSplitBill,
    handleNextStep,
    handlePreviousStep,
    handlePersonNameChange,
    handleItemAssignment,
    setNumberOfPeople,
  };
};
