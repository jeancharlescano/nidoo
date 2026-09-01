"use client";
import { useActionState } from "react";
import Button from "../../ui/Button";
import {
  onBoardingAction,
  type OnboardingState,
} from "@/lib/actions/onboarding";

const initialState: OnboardingState = {
  errors: [],
};

const OnBoardingForm = ({ buttonText }: { buttonText: string }) => {
  const [state, formAction, pending] = useActionState(
    onBoardingAction,
    initialState,
  );

  return (
    <form action={formAction}>
      {state?.errors && (
        <p className="text-red-500 font-semibold text-xs -mt-4 mb-4">
          {state.errors[0]}
        </p>
      )}
      <label className="flex flex-col text-sm font-semibold mb-4">
        Prénom
        <input
          className={`border border-[#DDE5DF]  px-2 p-3 mt-1 rounded-xl text-[#6B7280] font-medium tracking-wider`}
          name="firstName"
          type="text"
          placeholder="John"
        />
      </label>
      <label className="flex flex-col text-sm font-semibold mb-8">
        Nom
        <input
          className={`border border-[#DDE5DF] px-2 p-3 mt-1 rounded-xl font-medium tracking-wider`}
          name="lastName"
          type="text"
          placeholder="Snow"
        />
      </label>
      <Button buttonText={buttonText} disabled={pending} />
    </form>
  );
};

export default OnBoardingForm;
