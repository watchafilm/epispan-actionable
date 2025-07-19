import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SymphonyItem, ReferenceItem } from '@/lib/definitions';
import Link from 'next/link';

type InfoCardItem = SymphonyItem | ReferenceItem;

export function InfoCard({ item }: { item: InfoCardItem }) {
  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300 border-primary/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold font-headline text-primary-foreground bg-primary/80 -m-6 p-6 rounded-t-lg">
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-4xl font-bold text-foreground mb-2">{item.value}</p>
        <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.description }}/>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-bold">
          <Link href={item.buttonLink}>{item.buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
