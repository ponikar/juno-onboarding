import { router } from 'expo-router';
import { fill, S } from '@/copy/strings';
import { nextRoute } from '@/flow';
import { daysUntil } from '@/lib/dates';
import { track } from '@/lib/track';
import { useOnboarding } from '@/state/onboarding';
import { Calendar } from '@/ui/Calendar';
import { JunoReply } from '@/ui/JunoReply';
import { PrimaryButton, TextLink } from '@/ui/PrimaryButton';
import { ScreenShell, Title } from '@/ui/ScreenShell';

function replyFor(iso: string | null, answered: boolean) {
  if (!answered) return null;
  if (!iso) return S.appt.replyNone;
  const days = daysUntil(iso, new Date());
  if (days <= 0) return S.appt.replyToday;
  if (days === 1) return S.appt.replyTomorrow;
  return fill(S.appt.reply, { days });
}

// Screen 9 (from Figma 28 appointment).
export default function Appointment() {
  const { state, set } = useOnboarding();

  const pick = (iso: string) => {
    set({ nextAppointment: iso, appointmentAnswered: true });
    track('answer', { screen: 'appointment', nextAppointment: iso });
  };
  const none = () => {
    set({ nextAppointment: null, appointmentAnswered: true });
    track('answer', { screen: 'appointment', nextAppointment: null });
  };

  return (
    <ScreenShell
      route="/appointment"
      reply={<JunoReply text={replyFor(state.nextAppointment, state.appointmentAnswered)} />}
      footer={
        <>
          <TextLink label={S.appt.none} onPress={none} />
          <PrimaryButton label={S.common.continue} disabled={!state.appointmentAnswered} onPress={() => router.push(nextRoute('/appointment'))} />
        </>
      }>
      <Title why={S.appt.why}>{S.appt.q}</Title>
      <Calendar value={state.nextAppointment} onChange={pick} today={new Date()} />
    </ScreenShell>
  );
}
