import IntroHeader from "@/components/IntroHeader";
import InviteMemberForm from "@/components/InviteMemberForm";

const InviteMemberPage = () => {
  return (
    <div className="p-4">
      <IntroHeader />
      <h2 className="text-3xl mb-2 font-semibold">Suivre bébé à deux</h2>
      <p className="text-[#6B7280] mb-8 text-sm">
        Invitez l’autre parent pour synchroniser les événements en temps réel.
      </p>
      <div className="w-5/6 flex flex-col items-center text-[#1F2937] mb-8">
        <p className="text-4xl">👨‍👩‍👦</p>
        <p className="text-center text-sm">
          Les deux parents voient les mêmes données.
        </p>
      </div>
      <InviteMemberForm />
    </div>
  );
};

export default InviteMemberPage;
