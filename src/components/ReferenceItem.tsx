import type { Reference } from '@/lib/references';
import { Card, CardContent } from '@/components/ui/card';

export function ReferenceItemDisplay({ reference }: { reference: Reference }) {
  const { text } = reference;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
