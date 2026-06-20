import { render, screen } from '@testing-library/react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './components';

describe('Pagination', () => {
    it('renders without errors', () => {
        expect(() =>
            render(
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>,
            ),
        ).not.toThrow();
    });

    it('has data-slot="pagination"', () => {
        const { container } = render(<Pagination />);
        expect(
            container.querySelector('[data-slot="pagination"]'),
        ).toBeInTheDocument();
    });

    it('has data-slot="pagination-content"', () => {
        const { container } = render(
            <Pagination>
                <PaginationContent />
            </Pagination>,
        );
        expect(
            container.querySelector('[data-slot="pagination-content"]'),
        ).toBeInTheDocument();
    });

    it('has data-slot="pagination-item"', () => {
        const { container } = render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem />
                </PaginationContent>
            </Pagination>,
        );
        expect(
            container.querySelector('[data-slot="pagination-item"]'),
        ).toBeInTheDocument();
    });

    it('PaginationPrevious has correct aria-label', () => {
        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>,
        );
        expect(
            screen.getByLabelText('Go to previous page'),
        ).toBeInTheDocument();
    });

    it('PaginationNext has correct aria-label', () => {
        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>,
        );
        expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    });

    it('PaginationLink renders an anchor', () => {
        const { container } = render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>,
        );
        expect(container.querySelector('a')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('PaginationEllipsis renders without errors', () => {
        expect(() =>
            render(
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>,
            ),
        ).not.toThrow();
    });

    it('PaginationLink with isActive has aria-current="page"', () => {
        render(
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>,
        );
        expect(screen.getByText('2').closest('a')).toHaveAttribute(
            'aria-current',
            'page',
        );
    });
});
