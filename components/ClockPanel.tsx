import Clock from "@/components/Clock";

export default function ClockPanel() {
  return (
    <div className="panel">
      <div className="panel-label">System Clock</div>
      <Clock />
    </div>
  );
}
