import { FC } from 'react';
//import { useCurrentPath } from 'src/hooks';
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { useUserStore } from '@/store/user/userStore';
import useUserData from '@/graphql/useUserData';


const CopilotSidebarLayout: FC<any> = (props) => {
  const { userId, userAuth } = useUserStore();
  const { dataUser, errorUser, isLoadingUser } = useUserData(userId || "");

  const simplifiedUser = {
    id: userId,
    email: dataUser?.email,
    name: dataUser?.name,
  };

  useCopilotReadable({
    description: "Current state of the application",
    value: {
      dataUser: { name: dataUser?.name, id: userId },
      currentUser: simplifiedUser,
    },
  });
  
  // useCopilotReadable({
  //   description: "Frequently asked questions and answers about the application.",
  //   value: [
  //     {
  //       question: "How can I register to Sans Paper Form?",
  //       answer: "Go to url https://form.sanspaper.com/login. Click on the `Sign Up` button (light blue colored) and register with your email and password.",
  //     },
  //     {
  //       question: "How can I login into Sans Paper Form?",
  //       answer: "Go to url https://form.sanspaper.com/login. Click on the `Login` button (orange colored) and proceed to input your registered email and password. You will be redirected to dashboard after successful login.",
  //     }
  //   ],
  // });

  // useCopilotReadable({
  //   description: "Available actions in the application",
  //   value: [
  //     {
  //       action : "sayHello",
  //       description: "Say hello to someone.",
  //     },
  //     {
  //       action : "createForm",
  //       description: "Create a form with a name.",
  //     },
  //     {
  //       action : "createFormWithFields",
  //       description: "Create a form with fields.",
  //     },
  //     {
  //       action : "submitForm",
  //       description: "Go to the submit form page.",
  //     },
  //   ],
  // });

  // useCopilotAction(
  //   {
  //     name: "sayHello",
  //     description: "Say hello to someone.",
  //     parameters: [
  //       {
  //         name: "name",
  //         type: "string",
  //         description: "name of the person to say greet",
  //       },
  //     ],
  //     handler: async ({name}) => {
  //       alert(`App can do an action which is to say hello to , ${name}`);
  //       console.log(`Hello, ${name}!`);
  //     },
  //   }
  // );

  // useCopilotAction(
  //   {
  //     name: "createForm",
  //     description: "Create a form with a name.",
  //     parameters: [
  //       {
  //         name: "form_name",
  //         type: "string",
  //         description: "form name",
  //       },
  //     ],
  //     handler: async ({form_name}) => {
  //       alert(`App can create a form with name, ${form_name}`);
  //     },
  //   }
  // );

  // useCopilotAction(
  //   {
  //     name: "createFormWithFields",
  //     description: "create a form with fields.",
  //     parameters: [
  //       {
  //         name: "value",
  //         type: "string[]",
  //         description: "form name",
  //       },
  //     ],
  //     handler: async ({ value }) => {
  //       let text = "";
  //       for (let i = 0; i < value.length; i++) {
  //         if (i == 0) {
  //           text += "Form Name: " + value[i] + "\n";
  //         } else {
  //           text += value[i] + "\n";
  //         }
  //       }
  //       alert(`App can create a form. \n ${text}`);
  //     },
  //   }
  // );

  // useCopilotAction(
  //   {
  //     name: "submitForm",
  //     description: "Go to the submit form page.",
  //     parameters: [
  //       {
  //         name: "form_name",
  //         type: "string",
  //         description: "form name",
  //       },
  //     ],
  //     handler: async ({form_name}) => {
  //       navigate(`/my-subForms`);
  //       console.log(form_name);
  //       //alert(`App can create a form with name, ${form_name}`);
  //     },
  //   }
  // );

  return (
    <>
      <CopilotSidebar labels={{ title: "SansPaperID AI Chat", initial: "Hi! 👋 Welcome to SansPaperID AI Chat. You can try to ask me about yourself. Example :  `What is my email?` " }} ></CopilotSidebar>
    </>
  );
};

export default CopilotSidebarLayout;
