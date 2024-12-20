Layout.c

//include untuk printf

#include <stdlib.h>

//include untuk menggunakan syscall

#include <unistd.h>

int our_init_data; //inisiasi dengan nilai 30

int our_noinit_data;

void our_prints(void)

{

int our_local_data = 1;

printf("\nPid of the process is = %d", getpid());

printf("\nAddresses which fall into:");

printf("\n 1) Data segment = %", //type data pointer

&our_init_data);

printf("\n 2) BSS segment = %",//type data pointer

&our_noinit_data);

printf("\n 3) Code segment = %",//type data pointer

&our_prints);

printf("\n 4) Stack segment =%\n",//type data pointer

&our_local_data);

while(1);

}

int main()

{

// panggil fungsi yang telah dibuat

// return berhasil

}

pagemap.c

#define _POSIX_C_SOURCE 200809L

#include <stdio.h>

#include <stdlib.h>

#include <unistd.h>

#include <fcntl.h>

#include <errno.h>

#define PAGE_SIZE 0x1000

static void print_page(unsigned long address, unsigned long data) {

printf("0x%-16lx : pfn %-16lx soft-dirty %d file/shared %d "

"swapped %d present %d\n",

address,

data & 0x7fffffffffffff,

(data >> 55) & 1,

(data >> 61) & 1,

(data >> 62) & 1,

(data >> 63) & 1);

}

int main(int argc, char *argv[]) {

char filename[BUFSIZ];

if(argc != 4) {

printf("Usage: %s pid start_address end_address\n",

argv[0]);

return 1;

}

errno = 0;

int pid = (int)strtol(argv[1], NULL, 0);

if(errno) {

perror("strtol");

return 1;

}

snprintf(filename, sizeof filename, "/proc/%d/pagemap", pid);

int fd = open(filename, O_RDONLY);

if(fd < 0) {

perror("open");

return 1;

}

unsigned long start_address = strtoul(argv[2], NULL, 0);

unsigned long end_address = strtoul(argv[3], NULL, 0);

for(unsigned long i = start_address; i < end_address; i += 0x1000) {

unsigned long data;

unsigned long index = (i / PAGE_SIZE) * sizeof(data);

if(pread(fd, &data, sizeof(data), index) != sizeof(data)) {

perror("pread");

break;

}

print_page(i, data);

}

close(fd);

return 0;

}