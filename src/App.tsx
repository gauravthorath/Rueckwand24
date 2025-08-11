import { DesignerPage } from "./modules/designer/DesignerPage";
import { Toaster } from "sonner";

const App = () => {
	return (
		<div className="min-h-dvh bg-neutral-50">
			<DesignerPage />
			<Toaster
				position="top-right"
				duration={5000}
				toastOptions={{
					style: {
						fontSize: "16px",
						fontWeight: "500",
						padding: "16px",
						borderRadius: "12px",
						boxShadow:
							"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
					},
					className: "gap-6",
				}}
			/>
		</div>
	);
};

export default App;
