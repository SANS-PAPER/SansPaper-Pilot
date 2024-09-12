import { FC } from 'react';
import CopilotTextarea from "@copilotkit/react-textarea";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { useSelector } from 'react-redux';
// import { selectSelectActiveOrganization, selectAppActiveRole } from 'src/selector/app';
// import { selectUser } from 'src/selector/user';
// import { User } from 'src/models';

const CopilotTextareaLayout: FC<any> = (props) => {
//   const activeOrganization = useSelector(selectSelectActiveOrganization);
//   const activeRole = useSelector(selectAppActiveRole);
//   const user: User = useSelector(selectUser);

  useCopilotReadable({
    description: "Current state of the application",
    value: [
    //   {
    //     activeOrganization: activeOrganization,
    //     activeRole: activeRole,
    //     currentUser: user,
    //   },
      {
        action : "sayHello",
        description: "Say hello to someone.",
      },
      {
        action : "createForm",
        description: "Create a form with a name.",
      },
      {
        action : "createFormWithFields",
        description: "Create a form with fields.",
      },
    ],
  });

  useCopilotAction(
    {
      name: "sayHello",
      description: "Say hello to someone.",
      parameters: [
        {
          name: "name",
          type: "string",
          description: "name of the person to say greet",
        },
      ],
      handler: async ({name}) => {
        alert(`App can do an action which is to say hello to , ${name}`);
        console.log(`Hello, ${name}!`);
      },
    }
  );

  useCopilotAction(
    {
      name: "createForm",
      description: "Create a form with a name.",
      parameters: [
        {
          name: "form_name",
          type: "string",
          description: "form name",
        },
      ],
      handler: async ({form_name}) => {
        alert(`App can create a form with name, ${form_name}`);
      },
    }
  );

  useCopilotAction(
    {
      name: "createFormWithFields",
      description: "create a form with fields.",
      parameters: [
        {
          name: "value",
          type: "string[]",
          description: "form name",
        },
      ],
      handler: async ({ value }) => {
        let text = "";
        for (let i = 0; i < value.length; i++) {
          if (i == 0) {
            text += "Form Name: " + value[i] + "\n";
          } else {
            text += value[i] + "\n";
          }
        }
        alert(`App can create a form. \n ${text}`);
      },
    }
  );

  return (
    <>
      <CopilotTextarea
            className="custom-textarea-class"
            placeholder=""
            autosuggestionsConfig={{
              textareaPurpose: "Provide context or purpose of the textarea.",
              chatApiConfigs: {
                suggestionsApiConfig: {
                  forwardedParams: {
                    max_tokens: 20,
                    stop: [".", "?", "!"],
                  },
                },
              },
            }}
            disableBranding={true}
          />
    </>
  );
};

export default CopilotTextareaLayout;
