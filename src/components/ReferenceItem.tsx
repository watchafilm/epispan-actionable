import type { Reference } from '@/lib/references';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export function ReferenceItemDisplay({ reference }: { reference: Reference }) {
  const { text, doi } = reference;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground flex-grow">{text}</p>
        {doi && (
          <Button asChild variant="outline" size="sm" className="flex-shrink-0">
            <Link href={`https://doi.org/${doi}`} target="_blank" rel="noopener noreferrer">
              DOI
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
