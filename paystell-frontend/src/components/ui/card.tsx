import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	featured?: boolean;
}

const Card = ({ children, className, featured, ...props }: CardProps) => {
	return (
		<div
			className={cn(
				"relative rounded-lg p-8 shadow-sm",
				featured
					? "border-2 border-primary bg-background"
					: "border bg-background/50",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
};

export default Card;
