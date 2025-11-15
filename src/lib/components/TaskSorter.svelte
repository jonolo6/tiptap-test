<script lang="ts">
	import * as Select from '$lib/components/ui/select';

	let selectedSortOption: string = $state('name-asc'); // Initial sort option

	const sortOptions = [
		{ value: 'name-asc', label: 'Name (Ascending)' },
		{ value: 'name-desc', label: 'Name (Descending)' },
		{ value: 'price-asc', label: 'Price (Low to High)' },
		{ value: 'price-desc', label: 'Price (High to Low)' },
	];

	const sorted = $derived(sortData(data));

	// Function to handle sorting based on selectedSortOption
	function sortData(data: Task[], option?: string) {
		// Implement your sorting logic here
		console.log('Sorting by:', option);
		// Example:
		// if (option === "name-asc") { ... sort by name ascending ... }
		// else if (option === "price-desc") { ... sort by price descending ... }
	}

	$: {
		// Reactive declaration to call sortData when selectedSortOption changes
		sortData(selectedSortOption);
	}
</script>

<Select.Root bind:value={selectedSortOption}>
	<Select.Trigger class="w-[180px]">
		<Select.Value placeholder="Sort by..." />
	</Select.Trigger>
	<Select.Content>
		{#each sortOptions as option}
			<Select.Item value={option.value}>{option.label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
