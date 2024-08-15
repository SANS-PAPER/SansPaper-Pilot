import { useEffect, useState } from 'react';
import { initializeGraphQLClient } from '@/app/api/client';
import { GetFillupFormIdFromProfileDocument, GetSkillDropdDownListDocument } from '@/gql/_generated';
import { GetFillupFormIdFromProfileResponse, SkillNode } from '@/app/profile/types/userSkills';
import { FillupFormFieldNode } from '@/app/profile/types/fillupFormFields';

interface UseUserSkillReturnType {
  dataSkill: any[]; // Adjust based on your final expected structure
  errorSkill: Error | null;
  isLoadingSkill: boolean;
}

const useUserSkill = (userId: string): UseUserSkillReturnType => {
  const [dataSkill, setDataSkill] = useState<any[]>([]); // Adjust based on your final expected structure
  const [errorSkill, setErrorSkill] = useState<Error | null>(null);
  const [isLoadingSkill, setIsLoadingSkill] = useState<boolean>(true);

  const [client, setClient] = useState<any | null>(null); // State to hold the GraphQL client

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!client) {
          const initializedClient = await initializeGraphQLClient();
          setClient(initializedClient);
        }

        if (client) {
          console.log('ada client fetchUserSkill >>>>>>>>>', userId);
          const response = await fetchFillupFormIdFromProfile(client, userId);

          if (response.length === 0) {
            setDataSkill([]);
          } else {
            const skillData = response?.[0]?.skills;
            const skillIds = skillData.map(skill => skill.trim());
          
            const responseDropdownlist = await fetchSkill(client, skillIds.map(Number));
            setDataSkill(responseDropdownlist);
          }
        }
      } catch (error) {
        setErrorSkill(error as Error);
      } finally {
        setIsLoadingSkill(false);
      }
    };

    fetchData();

    return () => {
      // Any cleanup code if necessary
    };
  }, [client, userId]);

  return { dataSkill, errorSkill, isLoadingSkill };
};

// Function to Fetch User Skills
const fetchFillupFormIdFromProfile = async (client: any, userId: string): Promise<SkillNode[]> => {
  try {
    const response = await client.request(GetFillupFormIdFromProfileDocument, {
      userId,
    });
    return response?.profiles?.nodes ?? [];
  } catch (error) {
    console.error('Error fetching user skills:', error);
    throw error;
  }
};

// Function To Get Dropdownlist of All Skills
const fetchSkill = async (client: any, fillupFormId: number[]): Promise<any[]> => { // Adjusted return type
  const skillFieldId = 25991;
  const expiryFieldId = 25997;

  try {
    const response = await client.request(GetSkillDropdDownListDocument, {
      fillupFormId,
    });

    const answers: any[] = [];
    let skillDropDownList: string[] = [];

    response?.fillupFormFields?.nodes?.forEach((node: FillupFormFieldNode) => {
      if (node.fieldId === expiryFieldId) {
        const answer = {
          expiry: node.answer ?? null,
          skill: [],
        };

        const skillNode = response?.fillupFormFields?.nodes?.find(
          (skillNode: FillupFormFieldNode) =>
            skillNode.fieldId === skillFieldId &&
            skillNode.fillupFormId === node.fillupFormId,
        );

        if (skillNode) {
          const uuids = skillNode.answer ? JSON.parse(skillNode.answer) : [];
          answer.skill = uuids.map((uuid: string) => ({ uuid, description: null }));
        }

        answers.push(answer);
      }
    });

    skillDropDownList = response?.fillupFormFields?.nodes
      ?.filter((a: FillupFormFieldNode) => a.fieldId === skillFieldId)
      .map((a: FillupFormFieldNode) => a.field?.fieldProperties?.nodes?.[0]?.value ?? '') ?? [];

    const skillList = skillDropDownList.length > 0 ? JSON.parse(skillDropDownList[0]) : [];

    answers.forEach(a =>
      a.skill.forEach((u: any) => {
        const skill = skillList.find((skill: any) => skill.uuid === u.uuid);
        if (skill) {
          u.description = skill.description;
        }
      }),
    );

    return answers;
  } catch (error) {
    console.error('Error fetching dropdownlist:', error);
    throw error;
  }
};

export default useUserSkill;
